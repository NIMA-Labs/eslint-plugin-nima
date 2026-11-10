import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "restrict-imports";

export const enum Messages {
    IMPORT_DISALLOWED = "IMPORT_DISALLOWED",
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
            "Disallow use of any imports in any files or folders unless explicitly allowed.",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/restrict-imports.md",
    },
    messages: {
        [Messages.IMPORT_DISALLOWED]:
            "Do not import {{ importName }} inside {{ filename }}.",
    },
    schema: [
        {
            description: "List of rule option objects for restricting imports",
            items: {
                additionalProperties: false,
                description:
                    "Rule option that configures allowed/disabled imports and file matching",
                properties: {
                    allowImports: {
                        description: "Imports to allow",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    disableImports: {
                        description: "Imports to disable",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    files: {
                        description: "Files to match for rule",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    folders: {
                        description: "Folders to match for rule",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    from: {
                        description: "Source patterns to match (from)",
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
        allowImports: string[];
        disableImports: string[];
        files: string[];
        folders: string[];
        from: string[];
    }>[],
] = [[]];
