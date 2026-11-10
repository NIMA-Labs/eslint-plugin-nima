import { Messages, rule } from "@rules/no-named-types";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-named-types", rule, {
    invalid: [
        {
            code: "namespace Orders { export type Side = string }",
            errors: [{ messageId: Messages.NO_NAMED_TYPES }],
            name: "Plain namespaces are not ambient",
        },
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
        {
            code: "interface ImportMetaEnv { readonly VITE_API_URL: string }",
            filename: "vite-env.d.ts",
            name: "Declaration files are skipped",
        },
        {
            code: "declare namespace Analytics { type Event = string }",
            name: "Declared namespaces are ambient",
        },
        "const OrderRow: React.FC<{ id: string }> = ({ id }) => null;",
        "declare module '@tanstack/react-router' { interface Register { router: typeof router } }",
        "declare global { interface Window { ethereum: unknown } }",
        "declare type Legacy = string;",
        "const orders: Array<{ id: string }> = [];",
    ],
});
