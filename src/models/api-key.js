import { DataTypes, Model } from "sequelize";

import { Sequelize } from "../services/sequelize";
import { DefaultModelOptions } from "../services/sequelize/constants";
import { generateKey } from "../utils/hash";

class ApiKey extends Model {}

ApiKey.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      set(value) {
        this.setDataValue("name", value);
        this.setDataValue("key", generateKey(value));
      },
    },
    description: DataTypes.STRING,
    key: DataTypes.STRING,
  },
  {
    sequelize: Sequelize.sequelize,
    modelName: "ApiKey",
    ...DefaultModelOptions,
  },
);

export default ApiKey;
