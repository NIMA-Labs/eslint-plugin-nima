import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-custom-data-hooks";

export const enum Messages {
    NO_CUSTOM_DATA_HOOK = "NO_CUSTOM_DATA_HOOK",
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
            "Disallows custom hooks that wrap data hooks; components call the data hooks directly and derive inline",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-custom-data-hooks.md",
    },
    messages: {
        [Messages.NO_CUSTOM_DATA_HOOK]:
            "NIMA: '{{ name }}' wraps '{{ dataHook }}'. Call the data hook in the component that needs it and derive inline.",
    },
    schema: [
        {
            additionalProperties: false,
            properties: {
                allow: {
                    additionalProperties: false,
                    properties: {
                        files: { items: { type: "string" }, type: "array" },
                        folders: { items: { type: "string" }, type: "array" },
                    },
                    type: "object",
                },
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
        allow?: {
            files?: string[];
            folders?: string[];
        };
        dataSources?: string[];
    },
] = [
    {
        allow: { files: [], folders: [] },
        dataSources: ["monaco"],
    },
];
