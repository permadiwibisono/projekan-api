import crypto from "crypto";
import { appConfig } from "../config";
import { randomStr } from "./strings";

export const generateKey = (text) => {
  const rand = randomStr(4);
  return crypto
    .createHmac("sha256", appConfig.key)
    .update(text)
    .update(rand)
    .digest("base64");
};
