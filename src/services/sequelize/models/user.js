import { Model, DataTypes } from "sequelize";
import { DefaultModelOptions } from "../constants";
import Sequelize from "../sequelize";

import { passwordHash, verifyHash } from "../../../utils/hash";

const hidden = ["password"];

class User extends Model {
  verifyPassword(plainText) {
    return verifyHash(plainText, this.getDataValue("password"));
  }

  async genPasswordHash(plainText) {
    const hash = await passwordHash(plainText);
    this.setDataValue("password", hash);
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
