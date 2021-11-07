import "dotenv/config";

if (!process.env.JWT_SECRET) {
  throw new Error("`JWT_SECRET` is required");
}
// const expiresIn = 60 * 3;
const expiresIn = 3600 * 24 * 7;

export const jwtConfig = {
  issuer: process.env.JWT_ISSUER || "http://localhost:5000",
  secret: process.env.JWT_SECRET,
  expiresIn,
  refreshExpiresIn:
    expiresIn + (Math.floor(expiresIn / 2) ? Math.floor(expiresIn / 2) : 1),
  algorithm: "HS256",
};
