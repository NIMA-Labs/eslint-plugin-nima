import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "prefer-export-under-component";

export const enum Messages {
    EXPORT_BELOW_COMPONENT = "EXPORT_BELOW_COMPONENT",
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
            "Enforce separate declaration and export for React components",
        recommended: true,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-export-under-component.md",
    },
    fixable: "code",
    messages: {
        [Messages.EXPORT_BELOW_COMPONENT]:
            "NIMA: Declare React component '{{ functionName }}' separately from its export statement",
    },
    schema: [],
    type: "problem",
};

export const defaultOptions: [] = [];
