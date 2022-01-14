import compression from "compression";
import connect from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

import { appConfig } from "./config";
import { SESSION_NAME } from "./constants";
import { errorMiddleware, notFoundMiddleware } from "./middlewares";
import routes from "./routes";
import { initRedisClient } from "./services/redis";
import { sequelizeConnect } from "./services/sequelize";
import { AppLog, date } from "./utils";

class App {
  constructor() {
    this.host = express();
    this.redis = initRedisClient();
  }

  async connect() {
    AppLog.startup("DB connecting...");
    await sequelizeConnect();
    AppLog.startup("DB established...");

    AppLog.startup("Redis connecting...");
    const res = await this.redis.ping();
    AppLog.startup("Redis connected:", res);
  }

  init() {
    try {
      if (appConfig.env === "production") this.host.enable("trust proxy");

      this.host.use(compression());
      this.host.use(json());
      this.host.use(urlencoded({ extended: true }));
      this.host.use(cors());
      AppLog.log("cors enabled");

      const Store = connect(session);
      this.host.use(cookieParser(appConfig.session.secret));
      this.host.use(
        session({
          name: SESSION_NAME,
          saveUninitialized: false,
          resave: false,
          store: new Store({
            client: this.redis,
            disableTouch: false,
          }),
          cookie: appConfig.cookies,
          secret: appConfig.session.secret,
        }),
      );
      AppLog.log("session enabled");

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
