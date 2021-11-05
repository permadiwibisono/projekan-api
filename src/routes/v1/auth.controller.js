import express from "express";
import { omit } from "lodash";
import { SESSION_NAME } from "../../constants";
import UnauthorizedError from "../../errors/unauthorized.error";
import ValidatorError from "../../errors/validator.error";
import { authMiddleware } from "../../middlewares";
import { User } from "../../services/sequelize/models";
import { date } from "../../utils";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = {};
      if (!email) {
        err.email = ["The email is required"];
      }
      if (!password) {
        err.password = ["The password is required"];
      }
      throw new ValidatorError(err);
    }
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
      throw new ValidatorError({ email: ["The email or password not match"] });
    }
    const valid = await user.verifyPassword(password);
    if (!valid) {
      throw new ValidatorError({ email: ["The email or password not match"] });
    }
    user.lastLoggedInAt = date();
    req.session.userID = user.id;
    await user.save();
    const data = omit(user.toJSON(), ["password"]);
    res.json({ data, message: "Succeeded", statusCode: 200 }).status(200);
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const id = req.userID;
    const user = await User.findByPk(id);
    if (!user) {
      throw new UnauthorizedError();
    }
    res
      .json({ data: user.toJSON(), message: "Succeeded", statusCode: 200 })
      .status(200);
  } catch (error) {
    next(error);
  }
};

export const clearSession = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      res.clearCookie(SESSION_NAME);
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });

export const logout = async (req, res, next) => {
  try {
    await clearSession(req, res);
    res.json({ message: "Succeeded", statusCode: 200 }).status(200);
  } catch (error) {
    next(error);
  }
};

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, profile);
router.post("/logout", authMiddleware, logout);

export default router;
