import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "prefer-current-data";

export const enum Messages {
    PREFER_CURRENT_DATA = "PREFER_CURRENT_DATA",
    USE_CURRENT_DATA = "USE_CURRENT_DATA",
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
            "Requires reading `currentData` instead of `data` from RTK Query hooks so changed arguments never show stale results",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-current-data.md",
    },
    hasSuggestions: true,
    messages: {
        [Messages.PREFER_CURRENT_DATA]:
            "NIMA: Read 'currentData' instead of 'data' from '{{ hook }}'.",
        [Messages.USE_CURRENT_DATA]: "Read 'currentData' instead.",
    },
    schema: [
        {
            additionalProperties: false,
            properties: {
                dataSources: {
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
        dataSources?: string[];
    },
] = [
    {
        dataSources: ["monaco"],
    },
];
