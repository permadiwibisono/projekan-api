import { UnauthorizedError } from "../commons/errors";
import { COOKIE_REFRESH_TOKEN } from "../constants";
import { User } from "../models";
import { initRedisClient } from "../services/redis";
import {
  AppLog,
  authSession,
  jwtRefresh,
  jwtVerify,
  logoutSession,
  saveSession,
} from "../utils";

const refreshToken = async (req, res) => {
  try {
    const { accessToken, userID } = req.session;
    AppLog.debug("userID: ", userID);
    const refreshTokenValue = req.cookies[COOKIE_REFRESH_TOKEN];
    AppLog.debug("refreshTokenValue: ", refreshTokenValue);
    if (refreshTokenValue) {
      const redis = initRedisClient();
      const token = await redis.get(
        `${COOKIE_REFRESH_TOKEN}:${refreshTokenValue}`,
      );
      AppLog.debug("token redis: ", token);
      if (!token) {
        await logoutSession(req, res);
      } else if (token === accessToken) {
        const newToken = jwtRefresh(token);
        AppLog.debug("newToken: ", newToken);
        const user = await jwtVerify(newToken, {
          audience: userID.toString(),
        });
        AppLog.debug("user: ", user);
        await authSession(req, res, {
          userID,
          token: newToken,
          refreshToken: User.generateRefreshToken(user.email),
        });
        await saveSession(req);
        req.userID = userID;
        req.user = user;
        await redis.del(`${COOKIE_REFRESH_TOKEN}:${refreshTokenValue}`);
        return newToken;
      }
    }
    return null;
  } catch (error) {
    AppLog.error(error);
    throw error;
  }
};

export const authMiddleware = async (req, res, next) => {
  req.userID = null;
  if (!req.session?.userID || !req.session?.accessToken) {
    await logoutSession(req, res);
    next(new UnauthorizedError());
    return;
  }
  try {
    const user = await User.verifyToken(req.session.accessToken, {
      audience: req.session.userID.toString(),
    });
    req.userID = req.session.userID;
    req.user = user;
    next();
  } catch (error) {
    const jwtErrorType = [
      "TokenExpiredError",
      "JsonWebTokenError",
      "NotBeforeError",
    ];
    if (error.name && jwtErrorType.includes(error.name)) {
      if (
        error.name === "TokenExpiredError" &&
        req.cookies[COOKIE_REFRESH_TOKEN]
      ) {
        const token = await refreshToken(req, res);
        if (token) {
          next();
          return;
        }
      }
      next(new UnauthorizedError(error.name));
      return;
    }
    next(error);
  }
};
