'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {

    static associate({Message}) {
      Chat.hasMany(Message, {foreignKey: 'chatId', as: 'messages'})
    }
  }
  Chat.init({
    userId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};