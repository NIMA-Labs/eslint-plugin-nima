# `no-named-types`

Disallows named `type` aliases and `interface` declarations. Inline the type where it is used and let inference carry it; a derived alias (`type Row = ReturnType<typeof useRows>[number]`) is still a named type.

## What the rule checks

Every `type X = ...` and `interface X {}` declaration, exported or not, at any depth.

## What the rule allows

- Ambient declarations: anything inside `declare module`, `declare global` or `declare namespace`, and `declare type`. Module augmentation (`interface Register` for TanStack Router, `interface Window`) needs a named interface. A plain `namespace` is not ambient and is still checked.
- Declaration files (`*.d.ts`), such as `vite-env.d.ts` with `interface ImportMetaEnv`, where named interfaces are required for declaration merging.

For files that genuinely need named types (hand-written typings for a third-party library, React Navigation param lists), turn the rule off in an ESLint `files` block.

## Options

None.

## Examples

```ts
type OrderRowProps = { id: string };
// NIMA: Named type 'OrderRowProps' is not allowed. Inline the type where it is used.

const OrderRow: React.FC<{ id: string }> = ({ id }) => null;
// ✓
```
