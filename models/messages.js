const {DataTypes}= require('sequelize')
const sequelize= require('../utils/db')
const messages=  sequelize.define('Message',{
    sender_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    reciever_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
 module.exports=messages