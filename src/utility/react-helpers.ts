import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

const FUNCTION_WRAPPERS = new Set(["forwardRef", "memo", "useCallback"]);

const getCalleeName = ($callee: TSESTree.Expression) => {
    if ($callee.type === AST_NODE_TYPES.Identifier) {
        return $callee.name;
    }

    if (
        $callee.type === AST_NODE_TYPES.MemberExpression &&
        $callee.property.type === AST_NODE_TYPES.Identifier
    ) {
        return $callee.property.name;
    }

    return null;
};

export const isFunctionNode = ($node: TSESTree.Node) =>
    $node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    $node.type === AST_NODE_TYPES.FunctionDeclaration ||
    $node.type === AST_NODE_TYPES.FunctionExpression;

const getOutermostWrapper = (node: TSESTree.Node) => {
    let current = node;

    while (
        current.parent?.type === AST_NODE_TYPES.CallExpression &&
        FUNCTION_WRAPPERS.has(getCalleeName(current.parent.callee) ?? "")
    ) {
        current = current.parent;
    }

    return current;
};

export const getFunctionDeclarator = (node: TSESTree.FunctionLike) => {
    if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
        return node;
    }

    const outermostWrapper = getOutermostWrapper(node);

    return outermostWrapper.parent?.type === AST_NODE_TYPES.VariableDeclarator
        ? outermostWrapper.parent
        : null;
};

export const isDefaultExported = (node: TSESTree.FunctionLike) =>
    getOutermostWrapper(node).parent?.type ===
    AST_NODE_TYPES.ExportDefaultDeclaration;

export const getDeclaredFunctionName = (node: TSESTree.FunctionLike) => {
    const declarator = getFunctionDeclarator(node);

    if (declarator?.type === AST_NODE_TYPES.FunctionDeclaration) {
        return declarator.id?.name ?? null;
    }

    return declarator?.id.type === AST_NODE_TYPES.Identifier
        ? declarator.id.name
        : null;
};

export const isWrappedIn = ($node: TSESTree.Node, $wrapperName: string) =>
    $node.parent?.type === AST_NODE_TYPES.CallExpression &&
    getCalleeName($node.parent.callee) === $wrapperName;

export const isHookName = (name: string) => /^use[A-Z0-9]/.test(name);

export const getMemberChain = (node: TSESTree.Node) => {
    const chain: string[] = [];
    let current: TSESTree.Node = node;

    while (current.type === AST_NODE_TYPES.MemberExpression) {
        if (
            current.computed ||
            current.property.type !== AST_NODE_TYPES.Identifier
        ) {
            return null;
        }
        chain.unshift(current.property.name);
        current = current.object;
    }

    if (current.type !== AST_NODE_TYPES.Identifier) {
        return null;
    }

    chain.unshift(current.name);

    return chain;
};

export const isDataHookCall = (
    $node: TSESTree.CallExpression,
    $dataSources: string[]
) => {
    const chain = getMemberChain($node.callee);

    if (!chain || chain.length < 2) {
        return false;
    }

    const [root] = chain;
    const hook = chain.at(-1);

    return $dataSources.includes(root) && !!hook && isHookName(hook);
};
