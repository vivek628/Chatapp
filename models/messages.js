const {DataTypes}= require('sequelize')
const sequelize= require('../utils/db')
const messages=  sequelize.define('Message',{
  
    message:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
 module.exports=messages