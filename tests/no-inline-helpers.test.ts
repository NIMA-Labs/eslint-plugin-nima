import { Messages, rule } from "@rules/no-inline-helpers";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run("no-inline-helpers", rule, {
    invalid: [
        {
            code: `
const OrdersTable = ({ orders }) => {
    const handleExportCsv = () =>
        exportToCsv({
            filename: "orders",
            rows: orders,
        });
    return <Button onClick={handleExportCsv} />;
};`,
            errors: [{ messageId: Messages.SINGLE_STATEMENT_HANDLER }],
            options: [{ maxWrapperLines: 10 }],
        },
        {
            code: `
const useOrderTotals = () => {
    const total = () => fills.length;
    return { total: total() };
};`,
            errors: [{ messageId: Messages.NO_INLINE_HELPER }],
        },
        {
            code: `
const useMenu = () => {
    const handleOpen = () => setIsOpen(true);
    return <Button onPress={handleOpen} />;
};`,
            errors: [{ messageId: Messages.SINGLE_STATEMENT_HANDLER }],
        },
        {
            code: `
const OrderRow = ({ order }) => {
    const formatSide = (side) => side.toUpperCase();
    return <Text>{formatSide(order.side)}</Text>;
};`,
            errors: [{ messageId: Messages.NO_INLINE_HELPER }],
        },
        {
            code: `
const OrderRow = ({ order }) => {
    const sideColor = () => {
        return order.side === "buy" ? "text-up" : "text-down";
    };
    return <Text className={sideColor()} />;
};`,
            errors: [{ messageId: Messages.NO_INLINE_HELPER }],
        },
        {
            code: `
const OrderRow = ({ order }) => {
    const handlePress = () => openOrder(order.id);
    return <Pressable onPress={handlePress} />;
};`,
            errors: [{ messageId: Messages.SINGLE_STATEMENT_HANDLER }],
        },
        {
            code: `
const OrderRow = ({ order }) => {
    const handlePress = () => {
        openOrder(order.id);
    };
    return <Pressable onPress={handlePress} />;
};`,
            errors: [{ messageId: Messages.SINGLE_STATEMENT_HANDLER }],
        },
        {
            code: `
const OrderList = ({ orders }) => {
    const Row = ({ order }) => <Text>{order.id}</Text>;
    return orders.map((order) => <Row key={order.id} order={order} />);
};`,
            errors: [{ messageId: Messages.NESTED_COMPONENT }],
        },
        {
            code: `
const OrderList = ({ orders }) => {
    const renderItem = ({ item }) => <Text>{item.id}</Text>;
    const keyExtractor = (item) => item.id;
    return <FlatList data={orders} renderItem={renderItem} keyExtractor={keyExtractor} />;
};`,
            errors: [
                { messageId: Messages.NO_INLINE_HELPER },
                { messageId: Messages.NO_INLINE_HELPER },
            ],
        },
        {
            code: `
const OrderRow = React.memo(({ order }) => {
    const label = () => order.id;
    return <Text>{label()}</Text>;
});`,
            errors: [{ messageId: Messages.NO_INLINE_HELPER }],
        },
        {
            code: `
const OrderRow = ({ order }) => {
    React.useEffect(() => {
        const format = (value) => value.toFixed(2);
        log(format(order.price));
    }, []);
    return null;
};`,
            errors: [{ messageId: Messages.NO_INLINE_HELPER }],
        },
        {
            code: `
const useOrderTotals = () => {
    const sumFills = (fills) => fills.reduce((total, fill) => total + fill.size, 0);
    return sumFills([]);
};`,
            errors: [{ messageId: Messages.NO_INLINE_HELPER }],
        },
        {
            code: `
function OrderRow({ order }) {
    function format() {
        return order.id;
    }
    return format();
}`,
            errors: [{ messageId: Messages.NO_INLINE_HELPER }],
        },
    ],
    valid: [
        `
const OrderRow = ({ order }) => {
    const onRefresh = () => {
        refetch();
        track("refresh");
    };
    return <Pressable onPress={onRefresh} />;
};`,
        `
const OrdersTable = ({ orders }) => {
    const handleExportCsv = () =>
        exportToCsv({
            filename: "orders",
            rows: orders,
        });
    return <Button onClick={handleExportCsv} />;
};`,
        `
const Chart = () => {
    const prepareMarkers = (resolution) => {
        const interval = toInterval(resolution);
        return markers.filter((marker) => marker.interval === interval);
    };
    return <Markers items={prepareMarkers("1h")} />;
};`,
        `
const useLocale = () => {
    const setLocale = (next) => {
        setPreference(next);
        activateLocale(next);
    };
    return [preference, setLocale] as const;
};`,
        `
const OrderRow = ({ order }) => {
    const handleRefresh = React.useCallback(() => refetch(), []);
    return <Pressable onPress={handleRefresh} />;
};`,
        `
const Slider = () => {
    const updateFromTouch = (touchX) => {
        "worklet";
        progress.value = touchX;
    };
    return <Gesture onUpdate={(event) => updateFromTouch(event.x)} />;
};`,
        `
const NetworkList = ({ network }) => {
    const findMember = (id) => network.find((member) => member.id === id);
    return <Text>{findMember(rootId)?.name}{findMember(leafId)?.name}</Text>;
};`,
        `
const ShareCard = () => {
    React.useEffect(() => {
        const update = () => setScale(window.innerWidth);
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return null;
};`,
        `
const Chart = () => {
    React.useEffect(() => {
        const syncLabels = () => {
            frame = requestAnimationFrame(syncLabels);
        };
        syncLabels();
    }, []);
    return null;
};`,
        `
const useModal = ({ name }) => {
    const close = () => dispatch(closeModal({ name }));
    return { close };
};`,
        `
const useStoredValue = () => {
    const setValue = (next) => setRaw(JSON.stringify(next));
    return [value, setValue];
};`,
        `
const useToggle = () => {
    const toggle = () => setIsOpen((isOpen) => !isOpen);
    return toggle;
};`,
        `
const OrderRow = ({ order }) => {
    const handleSubmit = async () => {
        await submitOrder(order);
        navigation.goBack();
    };
    return <Pressable onPress={handleSubmit} />;
};`,
        `
const OrderRow = ({ order }) => {
    return <Pressable onPress={() => openOrder(order.id)} />;
};`,
        `
const OrderList = ({ orders }) => {
    React.useEffect(() => {
        subscribe();
    }, []);
    return orders.map((order) => <Text key={order.id}>{order.id}</Text>);
};`,
        `
const OrderTable = ({ orders }) => {
    const columns = React.useMemo(() => [{ cell: ({ row }) => row.id }], []);
    return <Table columns={columns} data={orders} />;
};`,
        `
const formatSide = (side) => side.toUpperCase();
const helper = () => {
    const inner = () => 1;
    return inner();
};`,
        {
            code: `
const useOrderTotals = () => {
    const sumFills = (fills) => fills.length;
    return sumFills([]);
};`,
            options: [{ checkHooks: false }],
        },
        {
            code: `
const OrderRow = ({ order }) => {
    const onPress = () => {
        openOrder(order.id);
        track("open");
    };
    return <Pressable onPress={onPress} />;
};`,
            options: [{ handlerPrefix: "on" }],
        },
    ],
});
