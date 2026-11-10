import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator<{ recommended: boolean }>(
    (name) =>
        `https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/${name}.md`
);
