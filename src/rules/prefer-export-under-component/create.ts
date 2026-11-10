import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import {
    getFunctionName,
    isComponentFunction,
    isReactReturn,
} from "@utility/function-helpers";

import { type defaultOptions, Messages } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>
) => {
    return {
        ExportDefaultDeclaration: (node: TSESTree.ExportDefaultDeclaration) => {
            if (node.declaration.type !== AST_NODE_TYPES.FunctionDeclaration) {
                return;
            }

            const functionName = node.declaration.id?.name;
            if (
                functionName &&
                isComponentFunction(functionName) &&
                isReactReturn(node.declaration)
            ) {
                context.report({
                    data: {
                        functionName,
                    },
                    fix: (fixer) => {
                        const sourceCode = context.sourceCode;
                        const text = sourceCode.getText(node);
                        const newText = text.replace(
                            /^export\s+default\s+/,
                            ""
                        );

                        return [
                            fixer.replaceText(node, newText),
                            fixer.insertTextAfter(
                                node,
                                `\n\nexport { ${functionName} };`
                            ),
                        ];
                    },
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                    node,
                });
            }
        },

        ExportNamedDeclaration: (node: TSESTree.ExportNamedDeclaration) => {
            if (!node.declaration) {
                return;
            }

            if (node.declaration.type === AST_NODE_TYPES.VariableDeclaration) {
                const declarator = node.declaration.declarations[0];
                if (!declarator.init) {
                    return;
                }

                const functionNode = declarator.init;
                if (
                    functionNode.type !==
                        AST_NODE_TYPES.ArrowFunctionExpression &&
                    functionNode.type !== AST_NODE_TYPES.FunctionExpression
                ) {
                    return;
                }

                const functionName = getFunctionName(functionNode);
                if (
                    functionName &&
                    isComponentFunction(functionName) &&
                    isReactReturn(functionNode)
                ) {
                    context.report({
                        data: {
                            functionName,
                        },
                        fix: (fixer) => {
                            const sourceCode = context.sourceCode;
                            const text = sourceCode.getText(node);
                            const newText = text.replace(/^export\s+/, "");

                            return [
                                fixer.replaceText(node, newText),
                                fixer.insertTextAfter(
                                    node,
                                    `\n\nexport { ${functionName} };`
                                ),
                            ];
                        },
                        messageId: Messages.EXPORT_BELOW_COMPONENT,
                        node,
                    });
                }
            }
        },

        FunctionDeclaration: (node: TSESTree.FunctionDeclaration) => {
            if (node.parent?.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
                return;
            }

            const functionName = getFunctionName(node);
            if (
                functionName &&
                isComponentFunction(functionName) &&
                isReactReturn(node)
            ) {
                context.report({
                    data: {
                        functionName,
                    },
                    fix: (fixer) => {
                        const sourceCode = context.sourceCode;
                        const text = sourceCode.getText(node.parent);
                        const newText = text.replace(/^export\s+/, "");

                        return [
                            fixer.replaceText(node.parent, newText),
                            fixer.insertTextAfter(
                                node.parent,
                                `\n\nexport { ${functionName} };`
                            ),
                        ];
                    },
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                    node: node.parent,
                });
            }
        },
    };
};
