import Sequelize from "sequelize";
import { AppKey } from "../models";

const project = "Projekan";
export default {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await AppKey.findOrCreate({
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
      await AppKey.destroy(
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
