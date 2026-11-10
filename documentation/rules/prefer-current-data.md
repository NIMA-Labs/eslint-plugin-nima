# `prefer-current-data`

Requires reading `currentData` instead of `data` from RTK Query hooks. `data` keeps the last result even after the query arguments change, so a screen can briefly show another market's or account's numbers; `currentData` is `undefined` until the result for the current arguments arrives.

## What the rule checks

- Destructuring `data` from a data hook call: `const { data } = monaco.exchange.useGetOrders()`.
- Reading `.data` straight off the call: `monaco.exchange.useGetOrders().data`.

A data hook is a call whose member chain starts with one of `dataSources` and ends in a `use*` name. Mutation tuples (`const [trigger, { data }] = ...`) are not checked.

## Options

```json
{
    "nima/prefer-current-data": ["error", { "dataSources": ["monaco"] }]
}
```

## Suggestions

The rule offers an editor suggestion (not an auto-fix, because it changes behaviour while arguments change):

```ts
const { data } = monaco.exchange.useGetOrders();
// → const { currentData: data } = monaco.exchange.useGetOrders();

const { data: orders } = monaco.exchange.useGetOrders();
// → const { currentData: orders } = monaco.exchange.useGetOrders();
```
