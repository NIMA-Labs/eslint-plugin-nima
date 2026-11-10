import { Messages, rule } from "@rules/restrict-console-methods";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("restrict-console-methods", rule, {
    invalid: [
        {
            code: "console.log('hello'); console.warn('warning');",
            errors: [
                {
                    data: { console: "log" },
                    messageId: Messages.NO_CONSOLE,
                },
                {
                    data: { console: "warn" },
                    messageId: Messages.NO_CONSOLE,
                },
            ],
        },

        {
            code: "console.log('foo'); console.error('bar');",
            errors: [
                {
                    data: { console: "log" },
                    messageId: Messages.NO_CONSOLE,
                },
                {
                    data: { console: "error" },
                    messageId: Messages.NO_CONSOLE,
                },
            ],
        },

        {
            code: "const fn = () => console.log('arrow function')",
            errors: [
                {
                    data: { console: "log" },
                    messageId: Messages.NO_CONSOLE,
                },
            ],
        },

        {
            code: "console.warn('uh oh')",
            errors: [
                {
                    data: { console: "warn" },
                    messageId: Messages.NO_CONSOLE,
                },
            ],
            options: [{ allow: ["log"] }],
        },

        {
            code: "console.error('error'); console.warn('warn');",
            errors: [
                {
                    data: { console: "error" },
                    messageId: Messages.NO_CONSOLE,
                },
            ],
            options: [{ allow: ["warn"] }],
        },

        {
            code: `
        console.log();
        console.warn();
        console.error();
        console.trace();
        console.group();
        console.clear();
      `,
            errors: [
                {
                    data: { console: "log" },
                    messageId: Messages.NO_CONSOLE,
                },
                {
                    data: { console: "warn" },
                    messageId: Messages.NO_CONSOLE,
                },
                {
                    data: { console: "error" },
                    messageId: Messages.NO_CONSOLE,
                },
                {
                    data: { console: "trace" },
                    messageId: Messages.NO_CONSOLE,
                },
                {
                    data: { console: "group" },
                    messageId: Messages.NO_CONSOLE,
                },
                {
                    data: { console: "clear" },
                    messageId: Messages.NO_CONSOLE,
                },
            ],
        },
    ],

    valid: [
        "myObject.log('not a console log')",

        "const obj = { console: { log: () => {} } }; obj.console.log('valid');",

        "console.info('info')",

        {
            code: "console.log('This is allowed')",
            options: [{ allow: ["log"] }],
        },

        {
            name: "Multiple methods allowed",
            code: `
        console.log('log');
        console.warn('warn');
        console.error('error');
      `,
            options: [{ allow: ["log", "warn", "error"] }],
        },

        "console['log']('computed access')",

        "const ref = console",
    ],
});
