import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-optional-call-expression";

export const enum Messages {
    BAD_CALL_EXPRESSION = "BAD_CALL_EXPRESSION",
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
        description:
            "Restricts the use of optional chaining in call expressions.",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-optional-call-expression.md",
    },
    messages: {
        [Messages.BAD_CALL_EXPRESSION]:
            "NIMA: Avoid using optional chaining on call expressions.",
    },
    schema: [],
    type: "suggestion",
};
export const defaultOptions: [] = [];
