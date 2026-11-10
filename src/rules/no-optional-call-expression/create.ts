import { TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { type defaultOptions, Messages } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>
) => {
    return {
        CallExpression: (node: TSESTree.CallExpression) => {
            if (node.optional) {
                context.report({
                    messageId: Messages.BAD_CALL_EXPRESSION,
                    node,
                });
            }
        },
    };
};
