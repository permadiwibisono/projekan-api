import express from "express";
import { v1Router } from "./v1";

export * from "./v1";

const router = express.Router();

router.use("/v1", v1Router);

router.get("/", (_, res) => {
  res.json({
    message: "Projekan's API",
    statusCode: 200,
  });
});

router.get("/foo", () => {
  throw Error("Foo Error");
});

export default router;
