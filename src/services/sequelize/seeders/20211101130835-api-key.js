import Sequelize from "sequelize";

import { ApiKey } from "../../../models";

const project = "Projekan";
export default {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await ApiKey.findOrCreate({
        where: { name: `${project}-web` },
        transaction,
      });
      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await ApiKey.destroy(
        {
          where: { name: { [Sequelize.Op.in]: [`${project}-web`] } },
        },
        { transaction },
      );
      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
