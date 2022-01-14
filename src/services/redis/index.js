import Redis from "ioredis";

import { redisConfig } from "../../config";

export const initRedisClient = () => {
  const redis = new Redis({
    host: redisConfig.host,
    port: parseInt(redisConfig.port, 10),
    keyPrefix: redisConfig.keyPrefix,
    password: redisConfig.password,
  });
  return redis;
};
