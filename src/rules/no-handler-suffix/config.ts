import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-handler-suffix";

export const enum Messages {
    BAD_HANDLER_NAME = "BAD_HANDLER_NAME",
}

export const config: {
    docs: { recommended: boolean } & RuleModule<
        Messages,
        typeof defaultOptions
    >["meta"]["docs"];
} & Omit<
    RuleModule<Messages, typeof defaultOptions>["meta"],
    "defaultOptions"
> = {
    docs: {
        description: "Suggests to use handleFn instead of fnHandler",
        recommended: true,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-handler-suffix.md",
    },
    fixable: "code",
    messages: {
        [Messages.BAD_HANDLER_NAME]:
            "NIMA: You shouldn't use the handler suffix, use the handle prefix instead ({{ fnWithGoodName }})",
    },
    schema: [],
    type: "problem",
};

export const defaultOptions: [] = [];
