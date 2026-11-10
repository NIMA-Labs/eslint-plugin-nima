import { Messages, rule } from "@rules/prefer-current-data";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-current-data", rule, {
    invalid: [
        {
            code: "const { data } = monaco.exchange.useGetOrders();",
            errors: [
                {
                    messageId: Messages.PREFER_CURRENT_DATA,
                    suggestions: [
                        {
                            messageId: Messages.USE_CURRENT_DATA,
                            output: "const { currentData: data } = monaco.exchange.useGetOrders();",
                        },
                    ],
                },
            ],
        },
        {
            code: "const { data: orders, isLoading } = monaco.exchange.useGetOrders();",
            errors: [
                {
                    messageId: Messages.PREFER_CURRENT_DATA,
                    suggestions: [
                        {
                            messageId: Messages.USE_CURRENT_DATA,
                            output: "const { currentData: orders, isLoading } = monaco.exchange.useGetOrders();",
                        },
                    ],
                },
            ],
        },
        {
            code: "const { data = [] } = monaco.exchange.useGetOrders();",
            errors: [
                {
                    messageId: Messages.PREFER_CURRENT_DATA,
                    suggestions: [
                        {
                            messageId: Messages.USE_CURRENT_DATA,
                            output: "const { currentData: data = [] } = monaco.exchange.useGetOrders();",
                        },
                    ],
                },
            ],
        },
        {
            code: "const orders = monaco.exchange.useGetOrders().data;",
            errors: [
                {
                    messageId: Messages.PREFER_CURRENT_DATA,
                    suggestions: [
                        {
                            messageId: Messages.USE_CURRENT_DATA,
                            output: "const orders = monaco.exchange.useGetOrders().currentData;",
                        },
                    ],
                },
            ],
        },
    ],
    valid: [
        "const { currentData } = monaco.exchange.useGetOrders();",
        "const { currentData: orders } = monaco.exchange.useGetOrders();",
        "const { data } = useQuery();",
        "const { data } = monaco.exchange.getOrders();",
        "const [trigger, { data }] = monaco.exchange.useCreateOrder();",
        {
            code: "const { data } = monaco.exchange.useGetOrders();",
            options: [{ dataSources: ["api"] }],
        },
    ],
});
