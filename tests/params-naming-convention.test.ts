import { Messages, rule } from "@rules/params-naming-convention";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("params-naming-convention", rule, {
    invalid: [
        {
            name: "Arrow function with two parameters",
            code: "const func = (param1: string, param2: number) => {}",
            errors: [
                {
                    messageId: Messages.USE_OBJECT_PARAMETERS,
                },
            ],
        },

        {
            name: "Function declaration with multiple parameters",
            code: "function testFunction(data: any, config: object, options: object) {}",
            errors: [
                {
                    messageId: Messages.USE_OBJECT_PARAMETERS,
                },
            ],
        },

        {
            name: "Array method (non-reduce) with multiple parameters",
            code: "['test'].map((element, idx) => {})",
            errors: [
                {
                    messageId: Messages.USE_OBJECT_PARAMETERS,
                },
            ],
        },

        {
            name: "Mixed ignored/non-ignored parameters",
            code: "const handler = (e: Event, customParam: string) => {}",
            errors: [
                {
                    messageId: Messages.USE_OBJECT_PARAMETERS,
                },
            ],
        },
    ],

    valid: [
        {
            code: "const func = (param: string) => {}",
            name: "Single parameter",
        },

        {
            code: "const func = ({param1, param2}: {param1: string, param2: number}) => {}",
            name: "Object destructuring",
        },

        {
            code: "const func = ($param1: string, $param2: number) => {}",
            name: "All prefixed parameters",
        },

        {
            code: "const func = (e: Event, $callback: Function) => {}",
            name: "All ignored parameters",
        },

        {
            code: "['test'].map((element, index) => {})",
            name: "Special case: second parameter named 'index'",
        },

        {
            code: "arr.reduce((acc, curr, idx, array) => {})",
            name: "Reduce function (ignored by default)",
        },

        { code: "const func = () => {}", name: "No parameters" },

        {
            code: "const func = (...args: any[]) => {}",
            name: "Rest parameters only",
        },
    ],
});

ruleTester.run("params-naming-convention with custom options", rule, {
    invalid: [
        {
            name: "Custom allowedParameters",
            code: "const func = (a: string, b: number, c: boolean) => {}",
            errors: [
                {
                    messageId: Messages.USE_OBJECT_PARAMETERS,
                },
            ],
            options: [{ allowedParameters: 2 }],
        },

        {
            name: "Custom ignorePrefixes",
            code: "const func = (custom: string, another: number) => {}",
            errors: [
                {
                    messageId: Messages.USE_OBJECT_PARAMETERS,
                },
            ],
            options: [
                {
                    allowedParameters: 0,
                    ignorePrefixes: ["_"],
                },
            ],
        },
    ],

    valid: [
        {
            name: "Custom allowedParameters",
            code: "const func = (a: string, b: number, c: boolean) => {}",
            options: [{ allowedParameters: 3 }],
        },

        {
            name: "Custom ignorePrefixes",
            code: "const func = (_param1: string, _param2: number) => {}",
            options: [{ ignorePrefixes: ["_"] }],
        },

        {
            name: "Custom ignore list",
            code: "const func = (customIgnored: string, another: number) => {}",
            options: [
                {
                    ignore: ["customIgnored", "another"],
                },
            ],
        },

        {
            name: "Custom ignoreFunctions - your failing test case",
            code: "const customReduce = (acc: any, curr: any, idx: number) => {}",
            options: [{ ignoreFunctions: ["customReduce"] }],
        },
    ],
});
