import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-named-types";

export const enum Messages {
    NO_NAMED_TYPES = "NO_NAMED_TYPES",
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
            "Disallows named type aliases and interfaces; inline the type where it is used",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-named-types.md",
    },
    messages: {
        [Messages.NO_NAMED_TYPES]:
            "NIMA: Named {{ kind }} '{{ name }}' is not allowed. Inline the type where it is used.",
    },
    schema: [],
    type: "suggestion",
};

export const defaultOptions: [] = [];
