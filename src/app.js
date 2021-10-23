import "dayjs/locale/id";
import express, { json, urlencoded } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import dayjs from "dayjs";
import Debug from "debug";
import { errorMiddleware, notFoundMiddleware } from "./middlewares";
import { appConfig } from "./config";

dayjs.locale("id");
const log = Debug("app:startup");
const errorLog = Debug("app:error");

class App {
  host;
  server;
  constructor() {
    this.host = express();
  }
  init() {
    try {
      this.host.enable("trust proxy");
      this.host.use(compression());
      this.host.use(json());
      this.host.use(urlencoded({ extended: true }));
      this.host.use(cors());
      log("cors enabled");
      this.host.use(helmet());
      log("helmet enabled");
      this.host.use(hpp());
      log("hpp enabled");
      this.host.use(
        morgan(
          "[:date[iso]] :method :url :status :res[content-length] - :response-time ms"
        )
      );
      log("morgan enabled");
      if (appConfig.env === "production") {
        const limiter = rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 100,
        });
        //  apply to all requests
        this.host.use(limiter);
        log("express-rate-limit enabled");
      }

      //register routes
      this.host.get("/", (_, res) =>
        res.json({ message: "Hello world", statusCode: 200 })
      );
      this.host.get("/foo", (_, res) => {
        throw Error("Foo Error");
      });

      //not found error
      this.host.use(notFoundMiddleware);

      //simple error middleware
      this.host.use(errorMiddleware);
    } catch (error) {
      errorLog("📌 Error was occurred");
      throw error;
    }
  }
}

export default App;
