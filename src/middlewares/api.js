import { ApiKey } from "../services/sequelize/models";
import { AppLog } from "../utils";

export const apiMiddleware = async (req, res, next) => {
  AppLog.debug("x-api-token: ", req.headers["x-api-token"]);
  if (req.headers["x-api-token"]) {
    const key = req.headers["x-api-token"];
    const data = await ApiKey.findOne({ where: { key } });
    if (data) {
      next();
      return;
    }
  }
  res
    .json({
      error: {
        message: "Unauthorized",
        statusCode: 401,
      },
    })
    .status(401);
};
