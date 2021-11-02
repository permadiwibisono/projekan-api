import "dayjs/locale/id";
import express, { json, urlencoded } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import { date, AppLog } from "./utils";
import { errorMiddleware, notFoundMiddleware } from "./middlewares";
import { appConfig, appDBConfig } from "./config";
import { sequelizeConnect } from "./services/sequelize";
import routes from "./routes";

class App {
  constructor() {
    this.host = express();
  }

  async connect() {
    AppLog.debug("DB Config: ", JSON.stringify(appDBConfig));
    AppLog.startup("DB connecting...");
    await sequelizeConnect();
    AppLog.startup("DB established...");
  }

  init() {
    try {
      AppLog.debug("App Config: ", JSON.stringify(appConfig));
      this.host.enable("trust proxy");
      this.host.use(compression());
      this.host.use(json());
      this.host.use(urlencoded({ extended: true }));
      this.host.use(cors());
      AppLog.log("cors enabled");
      this.host.use(helmet());
      AppLog.log("helmet enabled");
      this.host.use(hpp());
      AppLog.log("hpp enabled");
      this.host.use(
        morgan(
          "[:date[iso]] :method :url :status :res[content-length] - :response-time ms",
        ),
      );
      AppLog.log("morgan enabled");
      if (appConfig.env === "production") {
        const limiter = rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 100,
        });
        //  apply to all requests
        this.host.use(limiter);
        AppLog.log("express-rate-limit enabled");
      }

      // register routes
      this.host.use(routes);

      // not found error
      this.host.use(notFoundMiddleware);

      // simple error middleware
      this.host.use(errorMiddleware);
      AppLog.startup(
        `Server Started with PORT:${appConfig.port} at ${date().format()}`,
      );
    } catch (error) {
      AppLog.error("📌 Error was occurred");
      throw error;
    }
  }
}

export default App;
