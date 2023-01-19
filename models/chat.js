const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Chat = sequelize.define("chat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  chat: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING,
  },
});

module.exports = Chat;
