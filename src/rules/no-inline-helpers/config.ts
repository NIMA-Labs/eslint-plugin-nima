import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-inline-helpers";

export const enum Messages {
    NESTED_COMPONENT = "NESTED_COMPONENT",
    NO_INLINE_HELPER = "NO_INLINE_HELPER",
    SINGLE_STATEMENT_HANDLER = "SINGLE_STATEMENT_HANDLER",
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
            "Disallows one-off wrapper functions (a short single statement used once) inside components and hooks",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-inline-helpers.md",
    },
    messages: {
        [Messages.NESTED_COMPONENT]:
            "NIMA: '{{ name }}' is a component declared inside '{{ owner }}'. It remounts on every render; move it into its own component folder.",
        [Messages.NO_INLINE_HELPER]:
            "NIMA: '{{ name }}' is a one-off wrapper inside '{{ owner }}'. Inline it where it is used.",
        [Messages.SINGLE_STATEMENT_HANDLER]:
            "NIMA: '{{ name }}' is a one-off wrapper handler. Inline it into the prop that uses it.",
    },
    schema: [
        {
            additionalProperties: false,
            properties: {
                checkHooks: { type: "boolean" },
                handlerPrefix: { type: "string" },
                maxWrapperLines: { minimum: 1, type: "integer" },
            },
            type: "object",
        },
    ],
    type: "suggestion",
};

export const defaultOptions: [
    {
        checkHooks?: boolean;
        handlerPrefix?: string;
        maxWrapperLines?: number;
    },
] = [
    {
        checkHooks: true,
        handlerPrefix: "handle",
        maxWrapperLines: 3,
    },
];
