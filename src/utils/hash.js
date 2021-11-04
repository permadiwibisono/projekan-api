import crypto from "crypto";
import argon2 from "argon2";
import { appConfig } from "../config";
import { randomStr } from "./strings";

export const verifyHash = async (plainText, hash) => {
  const result = await argon2.verify(plainText, hash);
  return result;
};

export const passwordHash = async (plainText) => {
  const result = await argon2.hash(plainText);
  return result;
};

export const generateKey = (text) => {
  const rand = randomStr(4);
  return crypto
    .createHmac("sha256", appConfig.key)
    .update(text)
    .update(rand)
    .digest("base64");
};
