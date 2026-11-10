import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-comments";

export const enum Messages {
    NO_COMMENTS = "NO_COMMENTS",
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
            "Disallows comments; code should explain itself through naming and structure",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-comments.md",
    },
    messages: {
        [Messages.NO_COMMENTS]:
            "NIMA: Comments are not allowed. Rename or restructure the code until it explains itself.",
    },
    schema: [
        {
            additionalProperties: false,
            properties: {
                allow: {
                    items: { type: "string" },
                    type: "array",
                },
            },
            type: "object",
        },
    ],
    type: "suggestion",
};

export const defaultOptions: [
    {
        allow?: string[];
    },
] = [
    {
        allow: [String.raw`^\s*@ts-expect-error`, String.raw`^/\s*<reference`],
    },
];
