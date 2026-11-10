import { Messages, rule } from "@rules/no-custom-data-hooks";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-custom-data-hooks", rule, {
    invalid: [
        {
            code: `
const useLeverageStats = () => {
    const { currentData } = monaco.exchange.useGetAllOrders();
    return currentData?.length ?? 0;
};`,
            errors: [{ messageId: Messages.NO_CUSTOM_DATA_HOOK }],
        },
        {
            code: `
const useTotals = () => {
    const orders = monaco.exchange.useGetAllOrders();
    const trades = monaco.exchange.useGetAllUserTrades();
    return [orders, trades];
};`,
            errors: [{ messageId: Messages.NO_CUSTOM_DATA_HOOK }],
        },
        {
            code: `
function useMarket(symbol) {
    return monaco.exchange.useGetTradingPairs(undefined, {
        selectFromResult: ({ currentData }) => currentData?.[symbol],
    });
}`,
            errors: [{ messageId: Messages.NO_CUSTOM_DATA_HOOK }],
        },
        {
            code: `
const useBalances = () => api.wallet.useGetBalances();`,
            errors: [{ messageId: Messages.NO_CUSTOM_DATA_HOOK }],
            options: [{ dataSources: ["api"] }],
        },
    ],
    valid: [
        `
const PeriodStats = () => {
    const { currentData } = monaco.exchange.useGetAllOrders();
    return currentData?.length ?? 0;
};`,
        `
const useToggle = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return [isOpen, () => setIsOpen(!isOpen)];
};`,
        `
const useOrders = () => monaco.exchange.getOrders();`,
        `
const useBalances = () => api.wallet.useGetBalances();`,
        {
            code: `
const usePositionsQuery = () => monaco.exchange.useGetPositions();`,
            filename: "/repo/apps/web/src/tables/usePositionsQuery.ts",
            options: [{ allow: { folders: ["**/tables"] } }],
        },
    ],
});
