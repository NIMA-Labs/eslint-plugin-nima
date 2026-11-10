import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import {
    getDeclaredFunctionName,
    getFunctionDeclarator,
    isComponentName,
    isFunctionNode,
    isHookName,
    isWrappedIn,
} from "@utility/react-helpers";

import { type defaultOptions, Messages } from "./config";

const isWorklet = ($node: TSESTree.FunctionLike) =>
    $node.body?.type === AST_NODE_TYPES.BlockStatement &&
    $node.body.body.some(
        (statement) =>
            statement.type === AST_NODE_TYPES.ExpressionStatement &&
            statement.directive === "worklet"
    );

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>,
    [options]: Readonly<typeof defaultOptions>
) => {
    const {
        checkHooks = true,
        handlerPrefix = "handle",
        maxWrapperLines = 3,
    } = options;

    const findOwner = ($node: TSESTree.FunctionLike) => {
        const ancestors = context.sourceCode.getAncestors($node);

        for (let index = ancestors.length - 1; index >= 0; index--) {
            const ancestor = ancestors[index];

            if (!ancestor || !isFunctionNode(ancestor)) {
                continue;
            }

            const ownerName = getDeclaredFunctionName(ancestor);

            if (
                ownerName &&
                (isComponentName(ownerName) ||
                    (checkHooks && isHookName(ownerName)))
            ) {
                return { name: ownerName, node: ancestor };
            }
        }

        return null;
    };

    const getReadReferences = ($node: TSESTree.FunctionLike) => {
        const declarator = getFunctionDeclarator($node);

        if (!declarator) {
            return [];
        }

        return context.sourceCode
            .getDeclaredVariables(declarator)
            .flatMap((variable) => variable.references)
            .filter((reference) => reference.isRead());
    };

    const isReturnedFromHook = (
        $reference: { identifier: TSESTree.Node },
        $owner: { name: string; node: TSESTree.Node }
    ) => {
        const ancestors = context.sourceCode.getAncestors(
            $reference.identifier
        );

        if (
            !isHookName($owner.name) ||
            ancestors
                .slice(ancestors.indexOf($owner.node) + 1)
                .some(isFunctionNode)
        ) {
            return false;
        }

        let container = $reference.identifier.parent;

        while (
            container?.type === AST_NODE_TYPES.Property ||
            container?.type === AST_NODE_TYPES.ObjectExpression ||
            container?.type === AST_NODE_TYPES.ArrayExpression ||
            container?.type === AST_NODE_TYPES.TSAsExpression ||
            container?.type === AST_NODE_TYPES.TSSatisfiesExpression
        ) {
            container = container.parent;
        }

        return (
            container?.type === AST_NODE_TYPES.ReturnStatement ||
            (!!container && isFunctionNode(container))
        );
    };

    const check = ($node: TSESTree.FunctionLike) => {
        const name = getDeclaredFunctionName($node);

        if (!name) {
            return;
        }

        const owner = findOwner($node);

        if (!owner) {
            return;
        }

        if (isComponentName(name)) {
            context.report({
                data: { name, owner: owner.name },
                messageId: Messages.NESTED_COMPONENT,
                node: $node,
            });
            return;
        }

        if (isWorklet($node) || isWrappedIn($node, "useCallback")) {
            return;
        }

        const readReferences = getReadReferences($node);
        const [onlyReference] = readReferences;

        if (
            readReferences.length !== 1 ||
            !onlyReference ||
            isReturnedFromHook(onlyReference, owner)
        ) {
            return;
        }

        const hasSeveralStatements =
            $node.body?.type === AST_NODE_TYPES.BlockStatement &&
            $node.body.body.length > 1;
        const lineCount = $node.loc.end.line - $node.loc.start.line + 1;

        if (hasSeveralStatements || lineCount > maxWrapperLines) {
            return;
        }

        const isHandler =
            name.startsWith(handlerPrefix) &&
            /^[A-Z]/.test(name.slice(handlerPrefix.length));

        context.report({
            data: { name, owner: owner.name },
            messageId: isHandler
                ? Messages.SINGLE_STATEMENT_HANDLER
                : Messages.NO_INLINE_HELPER,
            node: $node,
        });
    };

    return {
        ArrowFunctionExpression: check,
        FunctionDeclaration: check,
        FunctionExpression: check,
    };
};
