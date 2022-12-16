const Sequelize = require("sequelize");

const env = require("dotenv");

env.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST_NAME,
  }
);

module.exports = sequelize;
