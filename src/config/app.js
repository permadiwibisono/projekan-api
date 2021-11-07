import "dotenv/config";

if (!process.env.APP_KEY || process.env.APP_KEY.length < 32) {
  throw new Error("`APP_KEY` is required and contains at least 32 characters");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("`SESSION_SECRET` is required");
}

export const appConfig = {
  key: process.env.APP_KEY,
  env: process.env.NODE_ENV || "development",
  stage: process.env.APP_STAGE || "local",
  port: process.env.PORT || 5000,
  session: {
    secret: process.env.SESSION_SECRET,
  },
  cookies: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // cookie only works in https
  },
};
