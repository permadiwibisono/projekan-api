import debug from "debug";

const DEBUG_PREFIX = "app";

export const createDebug = (prefix, name) => debug(`${prefix}:${name}`);

export default {
  startup: createDebug(DEBUG_PREFIX, "startup"),
  log: createDebug(DEBUG_PREFIX, "log"),
  error: createDebug(DEBUG_PREFIX, "error"),
  warn: createDebug(DEBUG_PREFIX, "warn"),
  info: createDebug(DEBUG_PREFIX, "info"),
  debug: createDebug(DEBUG_PREFIX, "debug"),
};
