import { Messages, rule } from "@rules/no-named-types";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-named-types", rule, {
    invalid: [
        {
            code: "type OrderRowProps = { id: string };",
            errors: [
                {
                    data: { kind: "type", name: "OrderRowProps" },
                    messageId: Messages.NO_NAMED_TYPES,
                },
            ],
        },
        {
            code: "interface Order { id: string }",
            errors: [
                {
                    data: { kind: "interface", name: "Order" },
                    messageId: Messages.NO_NAMED_TYPES,
                },
            ],
        },
        {
            code: "type Row = ReturnType<typeof useRows>[number];",
            errors: [{ messageId: Messages.NO_NAMED_TYPES }],
        },
        {
            code: "export type Side = 'buy' | 'sell';",
            errors: [{ messageId: Messages.NO_NAMED_TYPES }],
        },
        {
            code: "const build = () => { type Local = number; return 1 as Local; };",
            errors: [{ messageId: Messages.NO_NAMED_TYPES }],
        },
    ],
    valid: [
        "const OrderRow: React.FC<{ id: string }> = ({ id }) => null;",
        "declare module '@tanstack/react-router' { interface Register { router: typeof router } }",
        "declare global { interface Window { ethereum: unknown } }",
        "declare type Legacy = string;",
        "const orders: Array<{ id: string }> = [];",
    ],
});
