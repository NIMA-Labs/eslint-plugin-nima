import { DEFAULT_ABBREVIATIONS } from "@constants/abbreviations";
import { type TSESTree } from "@typescript-eslint/utils";
import { RuleContext, type Scope } from "@typescript-eslint/utils/ts-eslint";

import { type defaultOptions, Messages } from "./config";

const IGNORED_DEFINITIONS = new Set([
    "ImplicitGlobalVariable",
    "ImportBinding",
    "Type",
]);

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>,
    [options]: Readonly<typeof defaultOptions>
) => {
    const abbreviations = {
        ...DEFAULT_ABBREVIATIONS,
        ...options.abbreviations,
    };
    const allow = options.allow ?? [];

    const isAbbreviation = ($word: string) =>
        Object.hasOwn(abbreviations, $word) && !allow.includes($word);

    const findAbbreviation = ($name: string) => {
        const bareName = $name.replace(/^[$_]+/, "");

        if (!bareName || allow.includes($name) || allow.includes(bareName)) {
            return null;
        }

        const wholeName = bareName.toLowerCase();

        if (isAbbreviation(wholeName)) {
            return wholeName;
        }

        return (
            (bareName.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g) ?? [])
                .map((word) => word.toLowerCase())
                .find((word) => word.length > 1 && isAbbreviation(word)) ?? null
        );
    };

    const reportedIdentifiers: TSESTree.Identifier[] = [];

    const checkScope = ($scope: Scope.Scope) => {
        for (const variable of $scope.variables) {
            const definition = variable.defs[0];
            const identifier = variable.identifiers[0];

            if (
                !definition ||
                !identifier ||
                IGNORED_DEFINITIONS.has(definition.type) ||
                reportedIdentifiers.includes(identifier)
            ) {
                continue;
            }

            const abbreviation = findAbbreviation(variable.name);

            if (!abbreviation) {
                continue;
            }

            reportedIdentifiers.push(identifier);

            context.report({
                data: {
                    abbreviation,
                    name: variable.name,
                    suggestion: abbreviations[abbreviation],
                },
                messageId: Messages.NO_ABBREVIATIONS,
                node: identifier,
            });
        }

        for (const childScope of $scope.childScopes) {
            checkScope(childScope);
        }
    };

    return {
        "Program:exit": () => {
            const globalScope = context.sourceCode.scopeManager?.globalScope;

            if (globalScope) {
                checkScope(globalScope);
            }
        },
    };
};
