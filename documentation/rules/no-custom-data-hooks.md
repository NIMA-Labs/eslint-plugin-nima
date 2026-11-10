# `no-custom-data-hooks`

Disallows custom hooks that wrap data hooks. Components call the data hook they need directly and derive what they show inline; the data layer (e.g. RTK Query) already dedupes subscriptions.

## What the rule checks

A function named `use*` that calls a data hook — a call whose member chain starts with one of `dataSources` and ends in a `use*` name, such as `monaco.exchange.useGetOrders()`. The hook is reported once, at its declaration.

## Options

```json
{
    "nima/no-custom-data-hooks": [
        "error",
        {
            "dataSources": ["monaco"],
            "allow": { "files": ["use*Query.ts"], "folders": [] }
        }
    ]
}
```

- **dataSources** — root identifiers of the data layer. Default `["monaco"]`.
- **allow.files** / **allow.folders** — glob patterns where data hooks are allowed, e.g. hooks backing data tables. `files` matches the file name (`use*Query.ts`); `folders` matches the absolute directory, so start folder globs with `**/` (`**/tables/**`). Matching works like [`restrict-imports`](./restrict-imports.md).

Scope the rule to app code with an ESLint `files` block if packages legitimately compose hooks.

## Examples

```ts
const useLeverageStats = () => {
    const { currentData } = monaco.exchange.useGetAllOrders();
    return currentData?.length ?? 0;
};
// NIMA: 'useLeverageStats' wraps 'monaco.exchange.useGetAllOrders'. Call the data hook in the component that needs it and derive inline.
```

```tsx
const PeriodStats = () => {
    const { currentData: orders } = monaco.exchange.useGetAllOrders();
    return <Text>{orders?.length ?? 0}</Text>;
};
// ✓ the component reads the data hook itself
```
