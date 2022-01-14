import Sequelize from "sequelize";

import { appConfig, db as dbConfig } from "../../config";
import { createDebug } from "../../utils";

const config = dbConfig[appConfig.env];

const debug = createDebug("db", "info");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: (str) => debug(str),
  },
);

export const sequelizeConnect = () => sequelize.authenticate();

export default {
  sequelize,
  Sequelize,
};
