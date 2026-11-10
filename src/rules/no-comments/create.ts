import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { type defaultOptions, Messages } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>,
    [options]: Readonly<typeof defaultOptions>
) => {
    const allow = (options.allow ?? []).map((pattern) => new RegExp(pattern));

    return {
        Program: () => {
            for (const comment of context.sourceCode.getAllComments()) {
                if (allow.some((pattern) => pattern.test(comment.value))) {
                    continue;
                }

                context.report({
                    loc: comment.loc,
                    messageId: Messages.NO_COMMENTS,
                });
            }
        },
    };
};
