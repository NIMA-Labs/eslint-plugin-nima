import { Messages, rule } from "@rules/restrict-function-usage";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("manage-functions", rule, {
    invalid: [
        {
            name: "Disallow a function in a specific folder",
            code: "z.string().optional()",
            errors: [
                {
                    messageId: Messages.FUNCTION_DISALLOWED,
                },
            ],
            filename: "/src/routes/index.ts",
            options: [
                [
                    {
                        disableFunctions: ["optional"],
                        folders: ["**/routes"],
                    },
                ],
            ],
        },

        {
            name: "Disallow a function in a file that matches a file glob",
            code: "restrictedFunc()",
            errors: [
                {
                    messageId: Messages.FUNCTION_DISALLOWED,
                },
            ],
            filename: "/src/components/pages/HomePage.tsx",
            options: [
                [
                    {
                        disableFunctions: ["restrictedFunc"],
                        files: ["*Page.tsx"],
                        folders: ["**/components/**"],
                    },
                ],
            ],
        },

        {
            name: "Disallow a method on an object, including chained calls",
            code: "window.localStorage.setItem('key', 'value')",
            errors: [
                {
                    messageId: Messages.FUNCTION_DISALLOWED,
                },
            ],
            filename: "/src/utils/storage.ts",
            options: [
                [
                    {
                        disableFunctions: ["setItem"],
                        folders: ["**/utils"],
                    },
                ],
            ],
        },

        {
            name: "Multiple functions in a disable list",
            code: "setTimeout(callback, 1000)",
            errors: [
                {
                    messageId: Messages.FUNCTION_DISALLOWED,
                },
            ],
            filename: "/src/index.ts",
            options: [
                [
                    {
                        disableFunctions: ["eval", "setTimeout", "setInterval"],
                    },
                ],
            ],
        },

        {
            name: "Test multiple options where the first rule matches",
            code: "dangerousFunction()",
            errors: [
                {
                    messageId: Messages.FUNCTION_DISALLOWED,
                },
            ],
            filename: "/src/security/auth.ts",
            options: [
                [
                    {
                        disableFunctions: ["dangerousFunction"],
                        folders: ["**/security"],
                    },
                    {
                        allowFunctions: ["dangerousFunction"],
                        folders: ["**/admin"],
                    },
                ],
            ],
        },
    ],

    valid: [
        {
            name: "Function in a file not matching the folder restriction",
            code: "z.string().optional()",
            filename: "/src/utils/index.ts",
            options: [
                [
                    {
                        disableFunctions: ["optional"],
                        folders: ["**/routes"],
                    },
                ],
            ],
        },

        {
            name: "Folder matches but the file pattern does not",
            code: "restrictedFunc()",
            filename: "/src/components/atoms/Button.tsx",
            options: [
                [
                    {
                        disableFunctions: ["restrictedFunc"],
                        files: ["*Page.tsx"],
                        folders: ["**/components/**"],
                    },
                ],
            ],
        },

        {
            name: "A function that is in an allow list and in the correct location",
            code: "sharedFunction()",
            filename: "/src/shared/utils.ts",
            options: [
                [
                    {
                        disableFunctions: ["sharedFunction"],
                        folders: ["**/restricted"],
                    },
                    {
                        allowFunctions: ["sharedFunction"],
                        folders: ["**/shared"],
                    },
                ],
            ],
        },

        {
            name: "A globally allowed function (no files/folders specified)",
            code: "globallyAllowed()",
            filename: "/src/anywhere/file.ts",
            options: [
                [
                    {
                        allowFunctions: ["globallyAllowed"],
                    },
                ],
            ],
        },

        {
            name: "An allowed function with an object call",
            code: "obj.allowedMethod()",
            filename: "/src/services/api.ts",
            options: [
                [
                    {
                        allowFunctions: ["allowedMethod"],
                        folders: ["**/services"],
                    },
                ],
            ],
        },

        {
            name: "A function not in any restriction list",
            code: "unrestricted()",
            filename: "/src/test/file.ts",
            options: [
                [
                    {
                        disableFunctions: ["otherFunction"],
                        folders: ["**/test"],
                    },
                ],
            ],
        },

        {
            name: "No options are specified",
            code: "anyFunction()",
            filename: "/src/anywhere/file.ts",
            options: [[]],
        },
    ],
});
