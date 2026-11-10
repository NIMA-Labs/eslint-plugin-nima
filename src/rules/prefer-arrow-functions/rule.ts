import { createRule } from "@utility/core";

import { config, defaultOptions, Messages, name } from "./config";
import { create } from "./create";

export { name };

export const rule = createRule<typeof defaultOptions, Messages>({
    create,
    defaultOptions,
    meta: config,
    name,
});
