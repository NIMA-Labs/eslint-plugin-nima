import { Messages, rule } from "@rules/no-handler-suffix";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-handler-suffix", rule, {
    invalid: [
        {
            name: "Arrow function with 'Handler' suffix",
            code: "const clickHandler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleClick = () => {}",
        },

        {
            name: "Function declaration with 'Handler' suffix",
            code: "function submitHandler() {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "function handleSubmit() {}",
        },

        {
            name: "Function expression with 'Handler' suffix",
            code: "const errorHandler = function() {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleError = function() {}",
        },

        {
            name: "Generic 'handler' name",
            code: "const handler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handle = () => {}",
        },

        {
            name: "Case variations",
            code: "const ClickHandler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleClick = () => {}",
        },

        {
            name: "Complex event name",
            code: "const formSubmitHandler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleFormSubmit = () => {}",
        },

        {
            name: "Named function expression (both names)",
            code: "const myHandler = function namedHandler() {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleMy = function handleNamed() {}",
        },

        {
            name: "Multiple handlers",
            code: `
        const clickHandler = () => {};
        const submitHandler = () => {};
      `,
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: `
        const handleClick = () => {};
        const handleSubmit = () => {};
      `,
        },
    ],

    valid: [
        { code: "const handleClick = () => {}", name: "Valid 'handle' prefix" },
        "function handleSubmit() {}",
        "const handleError = function() {}",

        {
            code: "const onClick = () => {}",
            name: "Functions not ending with 'handler'",
        },
        "const submitForm = () => {}",
        "const processClick = () => {}",

        {
            code: "const handlerFactory = () => {}",
            name: "'handler' not as suffix",
        },
        "const createHandlerCookie = () => {}",

        {
            code: "const clickHandler = 'string value'",
            name: "Non-function variables",
        },
    ],
});

ruleTester.run("no-handler-suffix with naming conflicts", rule, {
    invalid: [
        {
            code: `
        const handleClick = 'existing variable';
        const clickHandler = () => {};
      `,
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: `
        const handleClick = 'existing variable';
        const handleClick2 = () => {};
      `,
        },
    ],

    valid: [
        `
      const handleClick = () => {};
      const handleSubmit = () => {};
    `,
    ],
});
