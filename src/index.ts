import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import type { ESLint, Linter } from "eslint";

import {
    BooleanNamingConvention,
    NoAbbreviations,
    NoComments,
    NoCustomDataHooks,
    NoHandlerSuffix,
    NoInlineHelpers,
    NoNamedTypes,
    NoObjectsInDeps,
    NoOptionalCallExpression,
    ParamsNamingConvention,
    PreferArrowFunctions,
    PreferCurrentData,
    PreferExportUnderComponent,
    PreferReactFc,
    PreferReactWithHooks,
    PreferVoidForOptionalParam,
    RestrictConsoleMethods,
    RestrictFunctionUsage,
    RestrictImports,
} from "./rules";

const rules = {
    [BooleanNamingConvention.name]: BooleanNamingConvention.rule,
    [NoAbbreviations.name]: NoAbbreviations.rule,
    [NoComments.name]: NoComments.rule,
    [NoCustomDataHooks.name]: NoCustomDataHooks.rule,
    [NoHandlerSuffix.name]: NoHandlerSuffix.rule,
    [NoInlineHelpers.name]: NoInlineHelpers.rule,
    [NoNamedTypes.name]: NoNamedTypes.rule,
    [NoObjectsInDeps.name]: NoObjectsInDeps.rule,
    [NoOptionalCallExpression.name]: NoOptionalCallExpression.rule,
    [ParamsNamingConvention.name]: ParamsNamingConvention.rule,
    [PreferArrowFunctions.name]: PreferArrowFunctions.rule,
    [PreferCurrentData.name]: PreferCurrentData.rule,
    [PreferExportUnderComponent.name]: PreferExportUnderComponent.rule,
    [PreferReactFc.name]: PreferReactFc.rule,
    [PreferReactWithHooks.name]: PreferReactWithHooks.rule,
    [PreferVoidForOptionalParam.name]: PreferVoidForOptionalParam.rule,
    [RestrictConsoleMethods.name]: RestrictConsoleMethods.rule,
    [RestrictFunctionUsage.name]: RestrictFunctionUsage.rule,
    [RestrictImports.name]: RestrictImports.rule,
};

const plugin = {
    configs: {} as {
        "flat/recommended": Linter.Config;
        recommended: ESLint.ConfigData;
    },

    meta: {
        name: "eslint-plugin-nima",
    },

    rules,
};

const recommended: {
    [RuleName in keyof typeof rules as `nima/${RuleName}`]?: FlatConfig.RuleLevel;
} = {
    "nima/no-handler-suffix": "error",
    "nima/prefer-export-under-component": "error",
    "nima/prefer-react-fc": "warn",
    "nima/restrict-console-methods": "error",
};

Object.assign(plugin.configs, {
    "flat/recommended": {
        plugins: {
            nima: plugin,
        },
        rules: recommended,
    },
    recommended: {
        plugins: ["nima"],
        rules: recommended,
    },
});

export = plugin;
