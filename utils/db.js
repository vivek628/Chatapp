const Sequelize= require('sequelize')
require('dotenv').config();
console.log(process.env.MYSQL_DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD)
const sequelize = new Sequelize(process.env.MYSQL_DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost',
  });
  
  module.exports = sequelize;