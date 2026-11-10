import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { isFileMatched } from "@utility/file-helpers";

import { type defaultOptions, Messages } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>,
    [options = []]: Readonly<typeof defaultOptions>
) => {
    const isFunctionDisabled = ({
        filename,
        functionName,
    }: {
        filename: string;
        functionName: string;
    }) => {
        return options.some((option) => {
            const {
                allowFunctions = [],
                disableFunctions = [],
                files = [],
                folders = [],
            } = option;

            let isAppliesToFile = false;
            isAppliesToFile =
                files.length === 0 && folders.length === 0
                    ? true
                    : isFileMatched({
                          filename,
                          files,
                          folders,
                      });

            if (allowFunctions.length > 0) {
                const isFunctionInAllowList = allowFunctions.some(
                    (listedFunction) =>
                        listedFunction.toLowerCase() ===
                        functionName.toLowerCase()
                );

                if (isFunctionInAllowList) {
                    return files.length === 0 && folders.length === 0
                        ? false
                        : !isAppliesToFile;
                }
                return false;
            }

            if (!isAppliesToFile) {
                return false;
            }

            if (
                disableFunctions.some(
                    (listedFunction) =>
                        listedFunction.toLowerCase() ===
                        functionName.toLowerCase()
                )
            ) {
                return true;
            }

            return false;
        });
    };

    return {
        CallExpression: (node: TSESTree.CallExpression) => {
            const callee = node.callee;
            const filename = context.filename;

            if (callee.type === AST_NODE_TYPES.Identifier) {
                if (
                    isFunctionDisabled({
                        filename,
                        functionName: callee.name.toLowerCase(),
                    })
                ) {
                    context.report({
                        data: {
                            filename,
                            functionName: callee.name,
                        },
                        messageId: Messages.FUNCTION_DISALLOWED,
                        node: callee,
                    });
                }
            } else if (
                callee.type === AST_NODE_TYPES.MemberExpression &&
                callee.property.type === AST_NODE_TYPES.Identifier &&
                isFunctionDisabled({
                    filename,
                    functionName: callee.property.name.toLowerCase(),
                })
            ) {
                context.report({
                    data: {
                        filename,
                        functionName: callee.property.name,
                    },
                    messageId: Messages.FUNCTION_DISALLOWED,
                    node: callee.property,
                });
            }
        },
    };
};
