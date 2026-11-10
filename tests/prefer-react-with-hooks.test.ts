import { Messages, rule } from "@rules/prefer-react-with-hooks";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-react-with-hooks", rule, {
    invalid: [
        {
            name: "Direct hook call without any import",
            code: "useEffect();",
            errors: [
                {
                    data: { hook: "useEffect" },
                    messageId: Messages.PREFER_REACT_PREFIX,
                },
            ],
            output: `import React from "react";\nReact.useEffect();`,
        },

        {
            name: "Named import of a single hook",
            code: `import { useState } from "react";\nuseState();`,
            errors: [
                {
                    data: { hook: "useState" },
                    messageId: Messages.PREFER_REACT,
                },
                {
                    data: { hook: "useState" },
                    messageId: Messages.PREFER_REACT_PREFIX,
                },
            ],
            output: `import React from "react";\nReact.useState();`,
        },

        {
            name: "Named import of a single hook with other non-hook imports",
            code: `import { useState, FC } from "react";\nuseState();`,
            errors: [
                {
                    data: { hook: "useState" },
                    messageId: Messages.PREFER_REACT,
                },
                {
                    data: { hook: "useState" },
                    messageId: Messages.PREFER_REACT_PREFIX,
                },
            ],
            output: `import React, { FC } from "react";\nReact.useState();`,
        },

        {
            name: "Multiple hook calls from a named import",
            code: `import { useState, useEffect } from "react";\nuseState();\nuseEffect();`,
            errors: [
                {
                    data: {
                        hook: "useState and useEffect",
                    },
                    messageId: Messages.PREFER_REACT,
                },
                {
                    data: { hook: "useState" },
                    messageId: Messages.PREFER_REACT_PREFIX,
                },
                {
                    data: { hook: "useEffect" },
                    messageId: Messages.PREFER_REACT_PREFIX,
                },
            ],
            output: `import React from "react";\nReact.useState();\nReact.useEffect();`,
        },

        {
            name: "Hook call with arguments in a function expression",
            code: `const MyComponent = () => {\n  useState(0);\n};`,
            errors: [
                {
                    messageId: Messages.PREFER_REACT_PREFIX,
                },
            ],
            output: `import React from "react";\nconst MyComponent = () => {\n  React.useState(0);\n};`,
        },
    ],
    valid: [
        {
            code: "import React from 'react'; React.useState();",
            name: "Valid: React namespace import and hook call",
        },

        {
            code: "import * as React from 'react'; React.useState();",
            name: "Valid: Namespace import and hook call",
        },

        {
            code: "import React, { memo } from 'react'; React.useState();",
            name: "Valid: Default and named import, valid hook usage",
        },

        {
            code: "import { someOtherFunction } from 'some-library'; someOtherFunction();",
            name: "Valid: Non-hook import and function call",
        },
    ],
});
