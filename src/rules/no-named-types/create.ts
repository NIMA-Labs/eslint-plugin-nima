import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { type defaultOptions, Messages } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>
) => {
    const isAmbientDeclaration = ($node: TSESTree.Node) =>
        context.sourceCode
            .getAncestors($node)
            .some(
                (ancestor) =>
                    ancestor.type === AST_NODE_TYPES.TSModuleDeclaration
            );

    const check = (
        $node: TSESTree.TSInterfaceDeclaration | TSESTree.TSTypeAliasDeclaration
    ) => {
        if ($node.declare || isAmbientDeclaration($node)) {
            return;
        }

        context.report({
            data: {
                kind:
                    $node.type === AST_NODE_TYPES.TSInterfaceDeclaration
                        ? "interface"
                        : "type",
                name: $node.id.name,
            },
            messageId: Messages.NO_NAMED_TYPES,
            node: $node.id,
        });
    };

    return {
        TSInterfaceDeclaration: check,
        TSTypeAliasDeclaration: check,
    };
};
