'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
const { signToken } = require('../tokenUtils');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    async setPassword (password) {
      this.password = await bcrypt.hash(password, 10);
    }
    async checkPassword (password) {
      return await bcrypt.compare(password, this.password);
    }
    async makeToken() {
      const { login } = this;
      return await signToken({ login });
    }
  };
  User.init({
    login: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};