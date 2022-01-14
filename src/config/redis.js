import "dotenv/config";

import { appConfig } from "./app";

export const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: appConfig.env === "local" ? undefined : process.env.REDIS_PASSWORD,
  keyPrefix: process.env.REDIS_PREFIX,
};
