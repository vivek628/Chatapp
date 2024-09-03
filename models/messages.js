const {DataTypes}= require('sequelize')
const sequelize= require('../utils/db')
const messages=  sequelize.define('Message',{
    sender_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    reciever_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
 module.exports=messages