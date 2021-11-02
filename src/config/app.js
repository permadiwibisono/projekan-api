import "dotenv/config";

if (!process.env.APP_KEY || process.env.APP_KEY.length < 32) {
  throw new Error("`APP_KEY` is required and contains at least 32 characters");
}
export const appConfig = {
  key: process.env.APP_KEY,
  env: process.env.NODE_ENV || "development",
  stage: process.env.APP_STAGE || "local",
  port: process.env.PORT || 5000,
};
