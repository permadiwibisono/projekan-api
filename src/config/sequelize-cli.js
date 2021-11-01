import { appConfig } from "./app";
import { db } from "./db";

export default {
  [appConfig.env]: {
    ...db[appConfig.env],
  },
};
