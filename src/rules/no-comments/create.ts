import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { type defaultOptions, Messages, TOOLING_COMMENTS } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>,
    [options]: Readonly<typeof defaultOptions>
) => {
    const allow = [...TOOLING_COMMENTS, ...(options.allow ?? [])].map(
        (pattern) => new RegExp(pattern)
    );
    const hasShebang = context.sourceCode.text.startsWith("#!");

    return {
        Program: () => {
            for (const comment of context.sourceCode.getAllComments()) {
                if (
                    (hasShebang && comment.range[0] === 0) ||
                    allow.some((pattern) => pattern.test(comment.value))
                ) {
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
