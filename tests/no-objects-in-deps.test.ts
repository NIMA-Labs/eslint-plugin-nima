import { Messages, rule } from "@rules/no-objects-in-deps";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-objects-in-deps", rule, {
    invalid: [
        {
            name: "Object literal in dependency array",
            code: "useEffect(() => {}, [{ NIMA: 'labs' }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
            output: "useEffect(() => {}, [JSON.stringify({ NIMA: 'labs' })])",
        },

        {
            name: "New expression in dependency array",
            code: "useEffect(() => {}, [new Date()])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
            output: "useEffect(() => {}, [JSON.stringify(new Date())])",
        },

        {
            name: "useCallback with object",
            code: "useCallback(() => {}, [{ NIMA: 'Enterprises' }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
            output: "useCallback(() => {}, [JSON.stringify({ NIMA: 'Enterprises' })])",
        },

        {
            name: "Multiple invalid dependencies",
            code: "useEffect(() => {}, [{ foo: 'bar' }, new Set()])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
            output: "useEffect(() => {}, [JSON.stringify({ foo: 'bar' }), JSON.stringify(new Set())])",
        },

        {
            name: "React namespace with object",
            code: "React.useEffect(() => {}, [{ test: true }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
            output: "React.useEffect(() => {}, [JSON.stringify({ test: true })])",
        },

        {
            name: "Bracket notation with object",
            code: "React['useCallback'](() => {}, [{ key: 'value' }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
            output: "React['useCallback'](() => {}, [JSON.stringify({ key: 'value' })])",
        },
    ],

    valid: [
        { code: "useEffect(() => {}, [])", name: "Empty dependency array" },

        {
            code: "useEffect(() => {}, [variable, 123, true, 'string'])",
            name: "Primitive values in dependencies",
        },

        {
            code: "React.useEffect(() => {}, [validVar])",
            name: "React namespace with variables",
        },

        {
            code: "useEffect(() => {}, [object.property])",
            name: "Property access (allowed)",
        },

        {
            code: "useEffect(() => {}, [getObject()])",
            name: "Function calls (allowed)",
        },

        {
            code: "someFunction([{ object: 'allowed' }])",
            name: "Not a hook - objects allowed",
        },

        { code: "useEffect(() => {})", name: "Hook without dependency array" },

        {
            code: "useEffect(() => {}, [[1, 2, 3]])",
            name: "Arrays are allowed (they're not problematic in deps)",
        },

        {
            code: "useMemo(() => {}, [['a', 'b']])",
            name: "Array variables are allowed",
        },

        {
            code: "useEffect(() => {}, [() => {}])",
            name: "Functions in deps are allowed",
        },
    ],
});
