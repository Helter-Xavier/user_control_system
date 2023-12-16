'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      Roles.belongsToMany(models.Users, {
      through: 'Users_roles',
      foreignKey: 'role_id', // Certifique-se de que esta é a coluna correta
});
    }
  }
  Roles.init({
    role_name: DataTypes.ENUM("Administrador", "Gerente", "Usuario Comum")
  }, {
    sequelize,
    modelName: 'Roles',
    timestamps: false,
  });
  return Roles;
};