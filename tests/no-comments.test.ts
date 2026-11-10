import { Messages, rule } from "@rules/no-comments";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-comments", rule, {
    invalid: [
        {
            code: "const total = 1; // running total",
            errors: [{ messageId: Messages.NO_COMMENTS }],
        },
        {
            code: "/* banner */\nconst total = 1;",
            errors: [{ messageId: Messages.NO_COMMENTS }],
        },
        {
            code: "/**\n * Adds numbers\n */\nconst add = () => 1;",
            errors: [{ messageId: Messages.NO_COMMENTS }],
        },
        {
            code: "// TODO: remove\n// prettier-ignore\nconst value = 1;",
            errors: [
                { messageId: Messages.NO_COMMENTS },
                { messageId: Messages.NO_COMMENTS },
            ],
        },
        {
            code: "#!/usr/bin/env node\n// setup\nconst value = 1;",
            errors: [{ line: 2, messageId: Messages.NO_COMMENTS }],
            name: "Only the shebang is exempt, not comments after it",
        },
    ],
    valid: [
        "#!/usr/bin/env node\nconst value = 1;",
        {
            code: "// @ts-expect-error broken types\n// keep: generated\nconst value = 1;",
            name: "Custom allow patterns add to the tooling defaults",
            options: [{ allow: ["^\\s*keep:"] }],
        },
        "const total = 1;",
        "// @ts-expect-error library types are wrong\nconst value = 1;",
        '/// <reference types="vite/client" />\nconst value = 1;',
        "const url = 'https://example.com';",
        {
            code: "// keep: generated\nconst value = 1;",
            options: [{ allow: ["^\\s*keep:"] }],
        },
    ],
});
