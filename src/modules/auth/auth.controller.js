import { omit } from "lodash";

import { UnauthorizedError, ValidatorError } from "../../commons/errors";
import { User } from "../../models";
import { authSession, date, logoutSession } from "../../utils";

export const loginAction = async (req, res, next) => {
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
    const token = user.generateToken();
    const refreshToken = User.generateRefreshToken(user.email);
    await authSession(req, res, { userID: user.id, token, refreshToken });
    const data = omit(user.toJSON(), ["password"]);
    user.lastLoggedInAt = date();
    await user.save();
    res.json({ data, message: "Succeeded", statusCode: 200 }).status(200);
  } catch (error) {
    next(error);
  }
};

export const profileAction = async (req, res, next) => {
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

export const logoutAction = async (req, res, next) => {
  try {
    await logoutSession(req, res);
    res.json({ message: "Succeeded", statusCode: 200 }).status(200);
  } catch (error) {
    next(error);
  }
};
