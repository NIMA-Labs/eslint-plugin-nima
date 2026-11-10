import { Messages, rule } from "@rules/boolean-naming-convention";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            projectService: {
                allowDefaultProject: ["*.ts*"],
            },
            tsconfigRootDir: __dirname,
        },
    },
});

ruleTester.run("boolean-naming-convention", rule, {
    invalid: [
        {
            name: "Variable: inferred boolean, missing prefix",
            code: "const NIMA = true",
            errors: [
                {
                    data: {
                        name: "NIMA",
                        suggestion: "isNIMA",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Variable: explicit true type, missing prefix",
            code: "const flag: true = true",
            errors: [
                {
                    data: {
                        name: "flag",
                        suggestion: "isFlag",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Variable: explicit false type, missing prefix",
            code: "const status: false = false",
            errors: [
                {
                    data: {
                        name: "status",
                        suggestion: "isStatus",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Variable: let with inferred boolean, missing prefix",
            code: "let active = false",
            errors: [
                {
                    data: {
                        name: "active",
                        suggestion: "isActive",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Variable: destructured boolean, missing prefix",
            code: "const { active }: { active: boolean } = obj",
            errors: [
                {
                    data: {
                        name: "active",
                        suggestion: "isActive",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Arrow function returns boolean, missing prefix",
            code: "const NIMA = () => true",
            errors: [
                {
                    data: {
                        name: "NIMA",
                        suggestion: "isNIMA",
                    },
                    messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Function expression returns boolean, missing prefix",
            code: "const validate = function(): boolean { return true; }",
            errors: [
                {
                    data: {
                        name: "validate",
                        suggestion: "isValidate",
                    },
                    messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Function declaration returns boolean, missing prefix",
            code: "function checkUser(): boolean { return true; }",
            errors: [
                {
                    data: {
                        name: "checkUser",
                        suggestion: "isCheckUser",
                    },
                    messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Arrow function with explicit boolean return, missing prefix",
            code: "const validate = (): boolean => true",
            errors: [
                {
                    data: {
                        name: "validate",
                        suggestion: "isValidate",
                    },
                    messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Function parameter of type boolean, missing prefix",
            code: "const NIMA = (nima: boolean) => {}",
            errors: [
                {
                    data: {
                        name: "nima",
                        suggestion: "isNima",
                    },
                    messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Function declaration with object parameter, missing prefix",
            code: "function test({ enabled }: { enabled: boolean }) {}",
            errors: [
                {
                    data: {
                        name: "enabled",
                        suggestion: "isEnabled",
                    },
                    messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Arrow function with object parameter, missing prefix",
            code: "const fn = ({ visible }: { visible: boolean }) => {}",
            errors: [
                {
                    data: {
                        name: "visible",
                        suggestion: "isVisible",
                    },
                    messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Function declaration with multiple boolean parameters, missing prefix",
            code: "function test(active: boolean, enabled: boolean) {}",
            errors: [
                {
                    data: {
                        name: "active",
                        suggestion: "isActive",
                    },
                    messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                },
                {
                    data: {
                        name: "enabled",
                        suggestion: "isEnabled",
                    },
                    messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Function declaration with nested object parameter, missing prefix",
            code: `function process({ 
        settings: { active, visible } 
      }: { 
        settings: { active: boolean, visible: boolean } 
      }) {}`,
            errors: [
                {
                    data: {
                        name: "active",
                        suggestion: "isActive",
                    },
                    messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                },
                {
                    data: {
                        name: "visible",
                        suggestion: "isVisible",
                    },
                    messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Object property with boolean value, missing prefix",
            code: "const NIMA = {\nnima: true}",
            errors: [
                {
                    data: {
                        name: "nima",
                        suggestion: "isNima",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Object property with boolean function, missing prefix",
            code: "const NIMA = {\nnima: () => true}",
            errors: [
                {
                    data: {
                        name: "nima",
                        suggestion: "isNima",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Object property with boolean-returning function expression, missing prefix",
            code: "const obj = { validate: function(): boolean { return true; } }",
            errors: [
                {
                    data: {
                        name: "validate",
                        suggestion: "isValidate",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Multiple object properties with boolean values/functions, missing prefix",
            code: `const config = {
        active: true,
        enabled: false,
        visible: () => true
      }`,
            errors: [
                {
                    data: {
                        name: "active",
                        suggestion: "isActive",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
                {
                    data: {
                        name: "enabled",
                        suggestion: "isEnabled",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
                {
                    data: {
                        name: "visible",
                        suggestion: "isVisible",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Nested object properties with boolean values/functions, missing prefix",
            code: `const config = {
        ui: {
          visible: true,
          enabled: () => false
        }
      }`,
            errors: [
                {
                    data: {
                        name: "visible",
                        suggestion: "isVisible",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
                {
                    data: {
                        name: "enabled",
                        suggestion: "isEnabled",
                    },
                    messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                },
            ],
        },

        {
            name: "Variable with union type including boolean, missing prefix",
            code: "const value: string | boolean = true",
            errors: [
                {
                    data: {
                        name: "value",
                        suggestion: "isValue",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
        },
    ],

    valid: [
        "const isNIMA = true",
        "const isEnabled: boolean = true",
        "const hasValue = false",
        "const canSubmit: true = true",
        "const shouldRender: false = false",
        "const IS_VALID = true",
        "const Has_Data = false",
        "const { isActive }: { isActive: boolean } = obj",
        "const { hasData, canEdit }: { hasData: boolean, canEdit: boolean } = config",

        "const isNIMA = () => true",
        "function isValid(): boolean { return true; }",
        "function hasPermission(): boolean { return false; }",
        "function canEdit(): boolean { return true; }",
        "function shouldUpdate(): boolean { return false; }",
        "function willRender(): boolean { return true; }",
        "const isActive = (): boolean => true",
        "const hasData = () => false",
        "const can_edit = () => true",
        "const canProcess = (): boolean => true",

        "const isNIMA = (isNima: boolean) => {}",
        "function test(isActive: boolean, hasData: boolean) {}",
        "const fn = (isVisible: boolean) => {}",
        "function process({ isEnabled }: { isEnabled: boolean }) {}",
        "function test(isActive?: boolean) {}",

        "const NIMA = {\nisNima: true}",
        "const NIMA = {\nisNima: () => true}",
        `const config = {
      isActive: true,
      hasData: false,
      canEdit: () => true,
      shouldUpdate: function(): boolean { return false; }
    }`,

        "const user = 'john'",
        "const age = 25",
        "const getData = () => 'data'",
        "function getName(): string { return 'name'; }",
        "const config = { name: 'test', value: 42 }",
        "function process(name: string, age: number) {}",
        "function test(name: string, isActive: boolean, age: number) {}",
        `const config = {
      name: 'test',
      isActive: true,
      count: 42,
      hasData: false
    }`,
        "function validate() { return 'valid'; }",
        "const check = () => ({ status: 'ok' })",
        `function process({ 
      name, 
      isActive, 
      age 
    }: { 
      name: string, 
      isActive: boolean, 
      age: number 
    }) {}`,
    ],
});

ruleTester.run("boolean-naming-convention with custom prefixes", rule, {
    invalid: [
        {
            name: "Custom allowedPrefixes option",
            code: "const active = true",
            errors: [
                {
                    data: {
                        name: "active",
                        suggestion: "isActive",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
            options: [{ allowedPrefixes: ["is", "has"] }],
        },
    ],
    valid: [
        {
            name: "Variable with allowed custom prefix",
            code: "const isActive = true",
            options: [{ allowedPrefixes: ["is", "has"] }],
        },
        {
            name: "Variable with another allowed custom prefix",
            code: "const hasData = true",
            options: [{ allowedPrefixes: ["is", "has"] }],
        },
    ],
});

ruleTester.run("boolean-naming-convention with disabled checks", rule, {
    invalid: [
        {
            name: "Only variables should be checked",
            code: "const active = true",
            errors: [
                {
                    data: {
                        name: "active",
                        suggestion: "isActive",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
            options: [
                {
                    checkFunctions: false,
                    checkParameters: false,
                    checkProperties: false,
                    checkVariables: true,
                },
            ],
        },
    ],
    valid: [
        {
            name: "Function should not trigger when checkFunctions is false",
            code: "function validate(): boolean { return true; }",
            options: [{ checkFunctions: false }],
        },
        {
            name: "Parameter should not trigger when checkParameters is false",
            code: "const fn = (active: boolean) => {}",
            options: [{ checkParameters: false }],
        },
        {
            name: "Property should not trigger when checkProperties is false",
            code: "const obj = { active: true }",
            options: [{ checkProperties: false }],
        },
    ],
});
