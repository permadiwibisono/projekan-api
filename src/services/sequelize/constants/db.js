import Sequelize from "sequelize";

export const CREATED_AT = "createdAt";
export const UPDATED_AT = "updatedAt";
export const DELETED_AT = "deletedAt";

export const ON_UPDATE_CASCADE = "CASCADE";
export const ON_DELETE_NULL = "SET NULL";

export const DbTimestampField = {
  [CREATED_AT]: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  [UPDATED_AT]: {
    allowNull: false,
    type: Sequelize.DATE,
  },
};
export const DbParanoidField = {
  [DELETED_AT]: {
    type: Sequelize.DATE,
  },
};

export const DefaultModelOptions = {
  timestamps: true,
  createdAt: CREATED_AT,
  updatedAt: UPDATED_AT,
};

export const ParanoidModelOptions = {
  paranoid: true,
  deletedAt: DELETED_AT,
};
