import { appConfig } from "../config";
import { AppLog } from "../utils";

export const errorMiddleware = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  } else {
    const message = err.message || "Internal server error";
    AppLog.debug("error --> ", `message: ${message}`);
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
