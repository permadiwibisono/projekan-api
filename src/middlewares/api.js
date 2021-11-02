import { ApiKey } from "../services/sequelize/models";

export const apiMiddleware = async (req, res, next) => {
  if (req.headers["x-api-token"]) {
    const key = req.headers["x-api-token"];
    const data = await ApiKey.findOne({ where: { key } });
    if (data) {
      next();
      return;
    }
  }
  res
    .send({
      error: {
        message: "Unauthorized",
        statusCode: 401,
      },
    })
    .status(401);
};
