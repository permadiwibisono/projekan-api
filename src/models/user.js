import { omit } from "lodash";
import { DataTypes, Model } from "sequelize";

import { Sequelize } from "../services/sequelize";
import { DefaultModelOptions } from "../services/sequelize/constants";
import { generateKey, jwtSign, jwtVerify } from "../utils";
import { passwordHash, verifyHash } from "../utils/hash";

const hidden = ["password"];

class User extends Model {
  verifyPassword(plainText) {
    return verifyHash(plainText, this.getDataValue("password"));
  }

  async genPasswordHash(plainText) {
    const hash = await passwordHash(plainText);
    this.setDataValue("password", hash);
  }

  generateToken() {
    const data = omit(this.toJSON(), hidden);
    return jwtSign({ sub: this.getDataValue("email"), ...data });
  }

  static generateRefreshToken(key) {
    return generateKey(key);
  }

  static verifyToken(token, options = {}) {
    return jwtVerify(token, options);
  }
}

User.init(
  {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    name: DataTypes.STRING,
    password: DataTypes.TEXT,
    isEmailVerified: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: false,
    },
    isSuspended: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: false,
    },
    lastLoggedInAt: DataTypes.DATE,
    suspendedAt: DataTypes.DATE,
  },
  {
    sequelize: Sequelize.sequelize,
    modelName: "User",
    defaultScope: {
      attributes: { exclude: hidden },
    },
    scopes: {
      withPassword: { attributes: {} },
    },
    ...DefaultModelOptions,
  },
);

export default User;