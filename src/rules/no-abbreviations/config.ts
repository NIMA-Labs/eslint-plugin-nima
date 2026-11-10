import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-abbreviations";

export const enum Messages {
    NO_ABBREVIATIONS = "NO_ABBREVIATIONS",
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
            "Disallows abbreviated identifiers like `e`, `idx` or `maxLev`; spell the full word",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-abbreviations.md",
    },
    messages: {
        [Messages.NO_ABBREVIATIONS]:
            "NIMA: '{{ name }}' uses the abbreviation '{{ abbreviation }}'. Spell it out: '{{ suggestion }}'.",
    },
    schema: [
        {
            additionalProperties: false,
            properties: {
                abbreviations: {
                    additionalProperties: { type: "string" },
                    type: "object",
                },
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
        abbreviations?: Record<string, string>;
        allow?: string[];
    },
] = [
    {
        abbreviations: {},
        allow: [],
    },
];
