import { SESSION_NAME, COOKIE_REFRESH_TOKEN } from "../constants";
import { appConfig, jwtConfig } from "../config";
import { initRedisClient } from "../services/redis";

export const authSession = async (
  req,
  res,
  { userID, token, refreshToken },
) => {
  req.session.userID = userID;
  req.session.accessToken = token;
  const redis = initRedisClient();
  await redis.setex(
    `${COOKIE_REFRESH_TOKEN}:${refreshToken}`,
    jwtConfig.refreshExpiresIn,
    token,
  );
  res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, appConfig.cookies);
};

export const logoutSession = async (req, res) => {
  const purge = (request, response) =>
    new Promise((resolve, reject) => {
      request.session.destroy((err) => {
        response.clearCookie(SESSION_NAME);
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  await purge(req, res);
  const get = req.cookies[COOKIE_REFRESH_TOKEN];
  const redis = initRedisClient();
  await redis.del(`${COOKIE_REFRESH_TOKEN}:${get}`);
  res.clearCookie(COOKIE_REFRESH_TOKEN);
};

export const saveSession = (req) =>
  new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
