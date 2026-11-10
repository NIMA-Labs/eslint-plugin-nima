import { Messages, rule } from "@rules/prefer-arrow-functions";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-arrow-functions", rule, {
    invalid: [
        {
            name: "Function declaration",
            code: "function NIMALabs() {}",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTIONS,
                },
            ],
            output: "const NIMALabs = () => {}",
        },

        {
            name: "Function declaration with parameters and types",
            code: "function sum(a: number, b: number): number { return a + b; }",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTIONS,
                },
            ],
            output: "const sum = (a: number, b: number): number => { return a + b; }",
        },

        {
            name: "Async function declaration",
            code: "async function asyncFunc() { await Promise.resolve(); }",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTIONS,
                },
            ],
            options: [{ allowAsync: false }],
            output: "const asyncFunc = async () => { await Promise.resolve(); }",
        },

        {
            name: "Exported function declaration",
            code: "export function exportedFunc(a: number) { return a * 2; }",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTIONS,
                },
            ],
            output: "export const exportedFunc = (a: number) => { return a * 2; }",
        },

        {
            name: "Export default function",
            code: "export default function defaultExported() { return 'foo'; }",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTIONS,
                },
            ],
            output: "const defaultExported = () => { return 'foo'; };\nexport default defaultExported",
        },

        {
            name: "Function expression",
            code: "const myFunc = function () {}",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
                },
            ],
            output: "const myFunc = () => {}",
        },

        {
            name: "Function expression with parameters",
            code: "const subtract = function(a: number, b: number): number { return a - b; };",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
                },
            ],
            output: "const subtract = (a: number, b: number): number => { return a - b; };",
        },

        {
            name: "Object property function",
            code: "const obj = { prop: function() {} };",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
                },
            ],
            output: "const obj = { prop: () => {} };",
        },

        {
            name: "Object method definition",
            code: "const myObject = { myMethod(a: number) { return a; } };",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_METHOD,
                },
            ],
            output: "const myObject = { myMethod: (a: number) => { return a; } };",
        },

        {
            name: "Class method definition",
            code: "class MyClass { myMethod() { return 1; } }",
            errors: [
                {
                    messageId: Messages.PREFER_ARROW_METHOD,
                },
                {
                    messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
                },
            ],
            output: "class MyClass { myMethod = () => { return 1; } }",
        },
    ],

    valid: [
        { code: "const NIMALabs = () => {}", name: "Arrow functions (valid)" },
        "const withParams = (a, b) => a + b;",
        "const myAsyncFunc = async () => {}",

        {
            name: "Functions with allowFunctionDeclarations option",
            code: "function allowedFunc() {}",
            options: [{ allowFunctionDeclarations: true }],
        },

        {
            name: "Generator functions with allowGenerators option",
            code: "function* generatorFunc() { yield 1; }",
            options: [{ allowGenerators: true }],
        },

        {
            name: "Class methods with allowMethodDefinitions option",
            code: "class MyClass { myMethod() {} }",
            options: [{ allowMethodDefinitions: true }],
        },

        {
            name: "Constructor with allowConstructors option",
            code: "class MyClass { constructor() {} }",
            options: [{ allowConstructors: true }],
        },

        {
            name: "Function expression with allowFunctionExpressions option",
            code: "const func = function() {};",
            options: [{ allowFunctionExpressions: true }],
        },
    ],
});
