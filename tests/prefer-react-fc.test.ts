import { Messages, rule } from "@rules/prefer-react-fc";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            projectService: {
                allowDefaultProject: ["*.ts*"],
            },
            tsconfigRootDir: __dirname,
        },
    },
});

ruleTester.run("prefer-react-fc", rule, {
    invalid: [
        {
            name: "Arrow function component without React.FC",
            code: "const Component = () => <div></div>",
            errors: [
                {
                    messageId: Messages.REQUIRE_REACT_FC,
                },
            ],
        },

        {
            name: "Function declaration component without React.FC",
            code: "function MyComponent() { return <div>Hello</div>; }",
            errors: [
                {
                    messageId: Messages.REQUIRE_REACT_FC,
                },
            ],
        },

        {
            name: "Function expression component without React.FC",
            code: "const MyFunc = function() { return <div />; }",
            errors: [
                {
                    messageId: Messages.REQUIRE_REACT_FC,
                },
            ],
        },

        {
            name: "Conditional rendering component without React.FC",
            code: `
        const ConditionalComponent = ({ condition }) => (
          condition ? <div>True</div> : <p>False</p>
        );
      `,
            errors: [
                {
                    messageId: Messages.REQUIRE_REACT_FC,
                },
            ],
        },

        {
            name: "Export default component without React.FC",
            code: "export default function DefaultComponent() { return <div />; }",
            errors: [
                {
                    messageId: Messages.REQUIRE_REACT_FC,
                },
            ],
        },

        {
            name: "Exported arrow component without React.FC",
            code: "export const ExportedComponent = () => <div />;",
            errors: [
                {
                    messageId: Messages.REQUIRE_REACT_FC,
                },
            ],
        },
    ],

    valid: [
        {
            code: "const Component: React.FC = () => <div></div>",
            name: "Arrow function component with React.FC",
        },

        {
            code: "const MyComponent: React.FunctionComponent = () => <div />",
            name: "Arrow function component with React.FunctionComponent",
        },

        {
            code: "const AnotherComponent: FC = () => <div />",
            name: "Arrow function component with FC alias",
        },

        {
            code: "const CustomComponent: PropsComponent = (props) => <div></div>",
            name: "Custom component type annotation",
        },

        {
            code: "function notAComponent() { return 'hello'; }",
            name: "Function returning non-JSX (should not trigger)",
        },

        {
            code: "const notAComponent = () => 42;",
            name: "Arrow function returning non-JSX (should not trigger)",
        },
    ],
});
