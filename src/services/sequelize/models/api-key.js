import { Model, DataTypes } from "sequelize";
import { generateKey } from "../../../utils/hash";
import { DefaultModelOptions } from "../constants";
import Sequelize from "../sequelize";

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
