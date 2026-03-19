import { HOOKS_WITH_DEPS } from "@constants/hooks";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import ts from "typescript";

import { Messages, type Options } from "./config";

export const create = (context: RuleContext<Messages, Options>) => {
    const services = context.sourceCode.parserServices;
    const checker = services?.program?.getTypeChecker();

    const getCalleeName = (node: TSESTree.CallExpression) => {
        const callee = node.callee;

        if (callee.type === AST_NODE_TYPES.Identifier) {
            return callee.name;
        }

        if (callee.type === AST_NODE_TYPES.MemberExpression) {
            if (
                !callee.computed &&
                callee.property.type === AST_NODE_TYPES.Identifier
            ) {
                return callee.property.name;
            }
            if (
                callee.computed &&
                callee.property.type === AST_NODE_TYPES.Literal
            ) {
                return String(callee.property.value);
            }
        }

        return null;
    };

    const isObjectType = (element: TSESTree.Expression): boolean => {
        if (element.type === AST_NODE_TYPES.ObjectExpression) {
            return true;
        }

        if (element.type === AST_NODE_TYPES.NewExpression) {
            return true;
        }

        if (
            element.type === AST_NODE_TYPES.Literal ||
            element.type === AST_NODE_TYPES.TemplateLiteral ||
            element.type === AST_NODE_TYPES.ArrayExpression ||
            element.type === AST_NODE_TYPES.ArrowFunctionExpression ||
            element.type === AST_NODE_TYPES.FunctionExpression
        ) {
            return false;
        }

        if (!checker || !services?.esTreeNodeToTSNodeMap) {
            return false;
        }

        try {
            const tsNode = services.esTreeNodeToTSNodeMap.get(element);
            if (!tsNode) {
                return false;
            }

            const type = checker.getTypeAtLocation(tsNode);
            if (!type) {
                return false;
            }

            const isPrimitiveType = (t: ts.Type): boolean => {
                const flags = t.getFlags();

                if (
                    flags &
                    (ts.TypeFlags.String |
                        ts.TypeFlags.Number |
                        ts.TypeFlags.Boolean |
                        ts.TypeFlags.BigInt |
                        ts.TypeFlags.ESSymbol |
                        ts.TypeFlags.Null |
                        ts.TypeFlags.Undefined |
                        ts.TypeFlags.Void |
                        ts.TypeFlags.StringLiteral |
                        ts.TypeFlags.NumberLiteral |
                        ts.TypeFlags.BooleanLiteral |
                        ts.TypeFlags.BigIntLiteral |
                        ts.TypeFlags.EnumLiteral)
                ) {
                    return true;
                }

                if (t.isUnion()) {
                    return t.types.every(isPrimitiveType);
                }

                if (t.isIntersection()) {
                    return false;
                }
                const typeStr = checker.typeToString(t);
                if (typeStr.startsWith("`") && typeStr.endsWith("`")) {
                    return true;
                }

                return false;
            };

            if (isPrimitiveType(type)) {
                return false;
            }

            if (type.getCallSignatures().length > 0) {
                return false;
            }

            const typeString = checker.typeToString(type);
            if (typeString.endsWith("[]") || typeString.startsWith("Array<")) {
                return false;
            }

            const properties = type.getProperties();
            if (properties.length > 0) {
                return true;
            }

            return false;
        } catch {
            return false;
        }
    };

    const checkDep = (element: TSESTree.Expression) => {
        if (isObjectType(element)) {
            const text = context.sourceCode.getText(element);
            context.report({
                data: {
                    object: text,
                },
                fix: (fixer) =>
                    fixer.replaceText(element, `JSON.stringify(${text})`),
                messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                node: element,
            });
        }
    };

    return {
        CallExpression: (node: TSESTree.CallExpression) => {
            const calleeName = getCalleeName(node);
            if (!calleeName || !HOOKS_WITH_DEPS.has(calleeName)) {
                return;
            }

            const deps = node.arguments[1];
            if (deps?.type === AST_NODE_TYPES.ArrayExpression) {
                for (const element of deps.elements) {
                    if (
                        !element ||
                        element.type === AST_NODE_TYPES.SpreadElement
                    ) {
                        continue;
                    }
                    checkDep(element);
                }
            }
        },
    };
};
