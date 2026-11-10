import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "restrict-function-usage";

export const enum Messages {
    FUNCTION_DISALLOWED = "FUNCTION_DISALLOWED",
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
            "Disallow use of any functions in any files or folders unless explicitly allowed.",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/restrict-function-usage.md",
    },
    messages: {
        [Messages.FUNCTION_DISALLOWED]:
            "Do not use {{ functionName }} inside {{ filename }}.",
    },
    schema: [
        {
            description:
                "List of rule option objects for restricting function usage",
            items: {
                additionalProperties: false,
                description:
                    "Rule option that configures allow/disable lists and file matching",
                properties: {
                    allowFunctions: {
                        description: "Functions to explicitly allow",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    disableFunctions: {
                        description: "Functions to disable",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    files: {
                        description: "Files glob list to apply rule",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    folders: {
                        description: "Folders glob list to apply rule",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                },
                type: "object",
            },
            type: "array",
        },
    ],
    type: "problem",
};

export const defaultOptions: [
    Partial<{
        allowFunctions: string[];
        disableFunctions: string[];
        files: string[];
        folders: string[];
    }>[],
] = [[]];
