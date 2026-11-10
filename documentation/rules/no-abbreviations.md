# `no-abbreviations`

Disallows abbreviated identifiers. Spell the full word: `event` not `e`, `index` not `idx`, `maxLeverage` not `maxLev`.

## What the rule checks

Every declared binding — variables, destructured names, parameters, function and class names, and catch parameters. Imports are skipped because their names come from the imported module, and type names and type parameters are skipped so single-letter generics (`<T, K>`) stay idiomatic.

- A whole identifier that is an abbreviation is reported, including single letters (`e`, `i`, `v`, `k`).
- Inside camelCase names, each word of two or more letters is checked (`maxLev`, `btnRef`, `formatAmt`). Single letters inside a name are not.
- Leading `$` and `_` are ignored (`$idx` is reported, `$month` is fine, `_` is skipped).

The default dictionary lives in `src/constants/abbreviations.ts` (`acc`, `btn`, `cb`, `ctx`, `e`, `err`, `evt`, `i`, `idx`, `msg`, `num`, `obj`, `opts`, `pct`, `prev`, `qty`, `res`, `src`, `tmp`, `val`, …).

## Options

```json
{
    "nima/no-abbreviations": [
        "error",
        {
            "abbreviations": { "usd": "dollars" },
            "allow": ["src"]
        }
    ]
}
```

- **abbreviations** — extra `abbreviation → full word` entries, merged over the defaults.
- **allow** — identifiers or words never reported, e.g. names that must mirror a DOM or library API.

## Examples

```ts
const handleChange = (e) => e.target;
// NIMA: 'e' uses the abbreviation 'e'. Spell it out: 'event'.

const maxLev = 10;
// NIMA: 'maxLev' uses the abbreviation 'lev'. Spell it out: 'leverage'.

list.filter((value, index) => list.indexOf(value) === index);
// ✓
```
