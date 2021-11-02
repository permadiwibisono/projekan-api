import express from "express";
import { apiMiddleware } from "../../middlewares";

const v1Router = express.Router();

v1Router.get("/bar", [apiMiddleware], (_, res) => {
  res.json({
    message: "Hello world, u can access the endpoint",
    statusCode: 200,
  });
});

export { v1Router };