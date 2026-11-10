import { Messages, rule } from "@rules/no-abbreviations";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-abbreviations", rule, {
    invalid: [
        {
            code: "class Btn {}",
            errors: [{ messageId: Messages.NO_ABBREVIATIONS }],
            name: "Class names are reported once",
        },
        {
            code: "const handleChange = (e) => e.target;",
            errors: [
                {
                    data: { abbreviation: "e", name: "e", suggestion: "event" },
                    messageId: Messages.NO_ABBREVIATIONS,
                },
            ],
        },
        {
            code: "const maxLev = 10;",
            errors: [
                {
                    data: {
                        abbreviation: "lev",
                        name: "maxLev",
                        suggestion: "leverage",
                    },
                    messageId: Messages.NO_ABBREVIATIONS,
                },
            ],
        },
        {
            code: "items.reduce((acc, item) => acc + item, 0);",
            errors: [{ messageId: Messages.NO_ABBREVIATIONS }],
        },
        {
            code: "list.filter((v, i) => list.indexOf(v) === i);",
            errors: [
                { messageId: Messages.NO_ABBREVIATIONS },
                { messageId: Messages.NO_ABBREVIATIONS },
            ],
        },
        {
            code: "const { btnRef, prevPrice } = props;",
            errors: [
                { messageId: Messages.NO_ABBREVIATIONS },
                { messageId: Messages.NO_ABBREVIATIONS },
            ],
        },
        {
            code: "try { run(); } catch (err) { report(err); }",
            errors: [{ messageId: Messages.NO_ABBREVIATIONS }],
        },
        {
            code: "const formatAmt = () => 1;",
            errors: [{ messageId: Messages.NO_ABBREVIATIONS }],
        },
        {
            code: "items.map(($idx) => $idx);",
            errors: [{ messageId: Messages.NO_ABBREVIATIONS }],
        },
        {
            code: "const usd = 1;",
            errors: [
                {
                    data: {
                        abbreviation: "usd",
                        name: "usd",
                        suggestion: "dollars",
                    },
                    messageId: Messages.NO_ABBREVIATIONS,
                },
            ],
            options: [{ abbreviations: { usd: "dollars" } }],
        },
    ],
    valid: [
        {
            code: "const pick = <T, K extends keyof T>(source: T, key: K) => source[key];",
            name: "Single-letter type parameters are allowed",
        },
        "const handleChange = (event) => event.target;",
        "const maxLeverage = 10;",
        "list.filter((value, index) => list.indexOf(value) === index);",
        "const pnl = 1; const mmr = 2; const bps = 3; const id = 4;",
        "const isEmpty = true; const evenRows = []; const element = null;",
        "import { cx } from 'cx'; import e from 'e';",
        "items.map(($month) => $month);",
        "const _ = 1;",
        "const fetchUserProfile = () => 1;",
        "const WidgetConstructor = 1; const toString = 2; const hasOwnProperty = 3;",
        {
            code: "const qty = 1;",
            options: [{ allow: ["qty"] }],
        },
        {
            code: "const orderQty = 1;",
            options: [{ allow: ["qty"] }],
        },
    ],
});
