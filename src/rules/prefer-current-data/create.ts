import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { getMemberChain, isDataHookCall } from "@utility/react-helpers";

import { type defaultOptions, Messages } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>,
    [options]: Readonly<typeof defaultOptions>
) => {
    const { dataSources = ["monaco"] } = options;

    const isDataKey = ($key: TSESTree.Node) =>
        $key.type === AST_NODE_TYPES.Identifier && $key.name === "data";

    return {
        CallExpression: (node: TSESTree.CallExpression) => {
            if (!isDataHookCall(node, dataSources)) {
                return;
            }

            const hook = getMemberChain(node.callee)?.join(".") ?? "";
            const parent = node.parent;

            if (
                parent.type === AST_NODE_TYPES.MemberExpression &&
                parent.object === node &&
                !parent.computed &&
                isDataKey(parent.property)
            ) {
                context.report({
                    data: { hook },
                    messageId: Messages.PREFER_CURRENT_DATA,
                    node: parent.property,
                    suggest: [
                        {
                            fix: (fixer) =>
                                fixer.replaceText(
                                    parent.property,
                                    "currentData"
                                ),
                            messageId: Messages.USE_CURRENT_DATA,
                        },
                    ],
                });
                return;
            }

            if (
                parent.type !== AST_NODE_TYPES.VariableDeclarator ||
                parent.id.type !== AST_NODE_TYPES.ObjectPattern
            ) {
                return;
            }

            for (const property of parent.id.properties) {
                if (
                    property.type !== AST_NODE_TYPES.Property ||
                    property.computed ||
                    !isDataKey(property.key)
                ) {
                    continue;
                }

                context.report({
                    data: { hook },
                    messageId: Messages.PREFER_CURRENT_DATA,
                    node: property.key,
                    suggest: [
                        {
                            fix: (fixer) =>
                                property.shorthand
                                    ? fixer.replaceText(
                                          property,
                                          `currentData: ${context.sourceCode.getText(property.value)}`
                                      )
                                    : fixer.replaceText(
                                          property.key,
                                          "currentData"
                                      ),
                            messageId: Messages.USE_CURRENT_DATA,
                        },
                    ],
                });
            }
        },
    };
};
