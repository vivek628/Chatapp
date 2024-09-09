const {DataTypes}= require('sequelize')
const sequelize= require('../utils/db')
const group = require('./group')
const groupmsg=sequelize.define('GroupMsg',{
    groupmsg:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    groupid:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,   
}})
module.exports=groupmsg