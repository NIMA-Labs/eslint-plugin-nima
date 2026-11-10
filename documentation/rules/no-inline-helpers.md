# `no-inline-helpers`

Disallows one-off wrapper functions inside components and hooks, and components declared inside other components.

A **one-off wrapper** is a named function that is used exactly once and whose body is a single statement no longer than `maxWrapperLines` lines. It adds a name and an indirection without removing any duplication, so it should be inlined where it is used.

## What the rule checks

Inside any component (PascalCase function, including `memo`/`forwardRef` wrappers) or hook (`use*` function):

1. **Nested components** — a PascalCase function declared inside another component or hook is always reported. It becomes a new component on every render, so React remounts its whole subtree.
2. **One-off wrappers** — a named function is reported when all of these hold:
    - it is referenced exactly once,
    - its body is a single statement (or an expression body),
    - it spans at most `maxWrapperLines` lines.

    `handle*` functions get a handler-specific message; anything else (`formatSide`, `sideColor`, `renderItem`) gets the helper message.

## What the rule allows

- Functions used more than once (shared logic, `addEventListener`/`removeEventListener` pairs, self-scheduling `requestAnimationFrame` loops).
- Multi-statement functions and single statements longer than `maxWrapperLines`.
- Functions marked with the `"worklet"` directive (Reanimated).
- Functions wrapped in `useCallback` (they declare a referential-stability need).
- Functions a hook returns (`return close`, `return { close }`, `return [value, setValue] as const`).
- Unnamed functions: inline callbacks, `.map((item) => ...)`, `onPress={() => ...}`, effect bodies.

## Options

```json
{
    "nima/no-inline-helpers": [
        "error",
        { "checkHooks": true, "handlerPrefix": "handle", "maxWrapperLines": 3 }
    ]
}
```

- **checkHooks** — also check `use*` functions. Default `true`.
- **handlerPrefix** — prefix that marks event handlers, used to pick the message. Default `"handle"`.
- **maxWrapperLines** — longest single statement still treated as a wrapper. Default `3`.

## Examples

```tsx
const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
    const handlePress = () => openOrder(order.id);
    // NIMA: 'handlePress' is a one-off wrapper handler. Inline it into the prop that uses it.

    const formatSide = (side: string) => side.toUpperCase();
    // NIMA: 'formatSide' is a one-off wrapper inside 'OrderRow'. Inline it where it is used.

    const Fill = () => <Text>{order.fills.length}</Text>;
    // NIMA: 'Fill' is a component declared inside 'OrderRow'. ...

    return (
        <PressableScale onPress={handlePress}>
            <Text>{formatSide(order.side)}</Text>
            <Fill />
        </PressableScale>
    );
};
```

```tsx
const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
    const handleSubmit = async () => {
        await submitOrder(order);
        navigation.goBack();
    };

    return (
        <PressableScale onPress={handleSubmit}>
            <Text>{order.side.toUpperCase()}</Text>
        </PressableScale>
    );
};
// ✓ multi-statement handler, inlined expression
```
