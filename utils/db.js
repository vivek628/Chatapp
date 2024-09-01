const Sequelize= require('sequelize')
const sequelize = new Sequelize(process.env.MYSQL_DB_NAME, process.env.DB_USER_NAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost',
  });
  
  module.exports = sequelize;