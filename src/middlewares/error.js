import { appConfig } from "../config";
import { AppLog } from "../utils";

export const errorMiddleware = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  } else {
    const message = err.message || "Internal server error";
    AppLog.debug("error --> ", `message: ${message}`, typeof err);
    AppLog.error(err);
    let code = 500;
    if (err.code) {
      code = err.code;
    }
    let result = {
      message:
        appConfig.env === "production" && code === 500
          ? "Internal server error"
          : message,
      statusCode: err.status || code,
    };
    if (err.errors) {
      result = {
        ...result,
        errors: err.errors,
      };
    }
    if (appConfig.env === "development") {
      result = {
        ...result,
        stack: err.stack,
      };
    }
    res.status(result.statusCode).json({ error: result });
  }
};
