import createError from "http-errors";

export const notFoundMiddleware = (_req, _res, next) =>
  next(createError(404, "Resource not found"));
