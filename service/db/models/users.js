'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Alterado de hasOne para hasMany, indicando que um usuário pode ter vários perfis
      Users.belongsToMany(models.Roles, {
        through: 'Users_roles',
        foreignKey: 'user_id',
      });
      Users.hasMany(models.Users_roles, { foreignKey: 'user_id' });
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    status: DataTypes.ENUM("Ativo", "Inativo", "Pendente", "Banido"),
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};