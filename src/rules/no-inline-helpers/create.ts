import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { isComponentFunction } from "@utility/function-helpers";
import {
    getDeclaredFunctionName,
    getFunctionDeclarator,
    isDefaultExported,
    isFunctionNode,
    isHookName,
    isWrappedIn,
} from "@utility/react-helpers";

import { type defaultOptions, Messages } from "./config";

const RETURN_VALUE_CONTAINERS = new Set<string>([
    AST_NODE_TYPES.ArrayExpression,
    AST_NODE_TYPES.ConditionalExpression,
    AST_NODE_TYPES.LogicalExpression,
    AST_NODE_TYPES.ObjectExpression,
    AST_NODE_TYPES.Property,
    AST_NODE_TYPES.SpreadElement,
    AST_NODE_TYPES.TSAsExpression,
    AST_NODE_TYPES.TSSatisfiesExpression,
]);

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

            if (!ownerName && isDefaultExported(ancestor)) {
                return { name: "default export", node: ancestor };
            }

            if (
                ownerName &&
                (isComponentFunction(ownerName) ||
                    (checkHooks && isHookName(ownerName)))
            ) {
                return { name: ownerName, node: ancestor };
            }
        }

        return null;
    };

    const getValueReadReferences = (
        $node: TSESTree.FunctionLike,
        $name: string
    ) => {
        const declarator = getFunctionDeclarator($node);

        if (!declarator) {
            return [];
        }

        return context.sourceCode
            .getDeclaredVariables(declarator)
            .filter((variable) => variable.name === $name)
            .flatMap((variable) => variable.references)
            .filter(
                (reference) =>
                    reference.isRead() &&
                    reference.identifier.parent?.type !==
                        AST_NODE_TYPES.TSTypeQuery
            );
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

        while (container && RETURN_VALUE_CONTAINERS.has(container.type)) {
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

        if (isComponentFunction(name)) {
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

        const readReferences = getValueReadReferences($node, name);
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
