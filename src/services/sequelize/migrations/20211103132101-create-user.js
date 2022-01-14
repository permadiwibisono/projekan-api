import Sequelize from "sequelize";

import { DbTimestampField } from "../constants";

export default {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      isEmailVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isSuspended: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastLoggedInAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      suspendedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      ...DbTimestampField,
    });
    await queryInterface.addIndex("Users", ["email"]);
  },
  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.dropTable("Users");
  },
};
