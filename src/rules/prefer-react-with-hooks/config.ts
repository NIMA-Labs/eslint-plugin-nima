import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "prefer-react-with-hooks";

export const enum Messages {
    PREFER_REACT = "PREFER_REACT",
    PREFER_REACT_PREFIX = "PREFER_REACT_PREFIX",
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
        description: "Enforce React.use* over named use* imports",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-react-with-hooks.md",
    },
    fixable: "code",
    messages: {
        [Messages.PREFER_REACT]:
            "NIMA: Use React.{{hook}} instead of importing {{hook}} directly.",
        [Messages.PREFER_REACT_PREFIX]: "NIMA: Prefix {{hook}} with React.",
    },
    schema: [],
    type: "problem",
};

export const defaultOptions: [] = [];
