import { appConfig } from "../config";

import Debug from "debug";

const debug = Debug("app:error");

export const errorMiddleware = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  } else {
    const message = err.message || "Internal server error";
    debug("error --> ", `message: ${message}`, message, err);
    let result = {
      message:
        appConfig.env === "development" ? message : "Internal server error",
      statusCode: err.status || 500,
    };
    if (appConfig.env === "development") {
      result = {
        ...result,
        stack: err.stack,
      };
    }
    res.status(result.statusCode).json({ error: result });
  }
};
