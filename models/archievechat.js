const {DataTypes, Model}= require('sequelize')
const sequelize= require('../utils/db')
const messages = require('./messages')
const archievechat= sequelize.define('archievechat',{
    message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      senderId:{
        type:DataTypes.INTEGER,
        allowNull: false
      },
      receiverId:{
        type:DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt:{
        type: DataTypes.DATE,
        allowNull: false
      }
})
module.exports=archievechat