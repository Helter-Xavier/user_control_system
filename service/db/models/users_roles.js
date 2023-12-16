'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users_roles extends Model {
    static associate(models) {
      Users_roles.belongsTo(models.Users, {
        foreignKey: 'user_id', // Corrigido para apontar para a coluna user_id correta na tabela Users
      });
      Users_roles.belongsTo(models.Roles, {
        foreignKey: 'role_id',
      });
    }
  }
  Users_roles.init({
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users_roles',
    timestamps: false,
  });
  return Users_roles;
};