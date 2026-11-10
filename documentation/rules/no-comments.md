# `no-comments`

Disallows comments. Code should explain itself through names and structure; if something needs a comment, rename it, split it, or restructure it.

## What the rule checks

Every line and block comment in the file, including JSDoc, `TODO`s, banners and `eslint-disable` directives.

Always allowed, because tools require them:

- a shebang (`#!/usr/bin/env node`) on the first line,
- `@ts-expect-error`,
- triple-slash `/// <reference>` directives.

## Options

```json
{
    "nima/no-comments": ["error", { "allow": ["^\\s*keep:"] }]
}
```

- **allow** — extra regular expressions tested against the comment text (without the `//` or `/* */`). They are added to the always-allowed tooling comments and never replace them. Default: `[]`.

## Examples

```ts
const total = 1; // running total
// NIMA: Comments are not allowed. Rename or restructure the code until it explains itself.

/** Adds two numbers */
const add = (left: number, right: number) => left + right;
// NIMA: Comments are not allowed. ...
```

```ts
// @ts-expect-error the library types are wrong
const value = library.call();
// ✓ always allowed
```

## Notes

- Because `eslint-disable` comments are themselves reported, exceptions for any rule belong in the ESLint config (`files` blocks or rule options), never in source comments.
- Not auto-fixable: deleting a comment is safe, but the code it described usually needs renaming first.
