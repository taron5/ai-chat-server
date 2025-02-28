'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate({Chat}) {
      Message.belongsTo(Chat, {foreignKey: 'chatId', as: 'chat'})
    }
  }

  Message.init({
    chatId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Chats',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'cascade',
    },
    messasge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender: {
      type: DataTypes.ENUM(['user', 'ai']),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};