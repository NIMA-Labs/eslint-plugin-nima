import { type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { isFileMatched } from "@utility/file-helpers";
import {
    getDeclaredFunctionName,
    getMemberChain,
    isDataHookCall,
    isFunctionNode,
    isHookName,
} from "@utility/react-helpers";

import { type defaultOptions, Messages } from "./config";

export const create = (
    context: RuleContext<Messages, typeof defaultOptions>,
    [options]: Readonly<typeof defaultOptions>
) => {
    const { allow = {}, dataSources = ["monaco"] } = options;

    const isAllowedFile = isFileMatched({
        filename: context.filename,
        files: allow.files ?? [],
        folders: allow.folders ?? [],
    });

    if (isAllowedFile) {
        return {};
    }

    const reported: TSESTree.Node[] = [];

    const findEnclosingHook = ($node: TSESTree.Node) => {
        const ancestors = context.sourceCode.getAncestors($node);

        for (let index = ancestors.length - 1; index >= 0; index--) {
            const ancestor = ancestors[index];

            if (!ancestor || !isFunctionNode(ancestor)) {
                continue;
            }

            const name = getDeclaredFunctionName(ancestor);

            if (name && isHookName(name)) {
                return { name, node: ancestor };
            }
        }

        return null;
    };

    return {
        CallExpression: (node: TSESTree.CallExpression) => {
            if (!isDataHookCall(node, dataSources)) {
                return;
            }

            const hook = findEnclosingHook(node);

            if (!hook || reported.includes(hook.node)) {
                return;
            }

            reported.push(hook.node);

            context.report({
                data: {
                    dataHook: getMemberChain(node.callee)?.join(".") ?? "",
                    name: hook.name,
                },
                messageId: Messages.NO_CUSTOM_DATA_HOOK,
                node: hook.node,
            });
        },
    };
};
