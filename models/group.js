const {DataTypes}= require('sequelize')
const sequelize= require('../utils/db')
const group=sequelize.define('Group',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    groupname:{
        type:DataTypes.STRING,
        allowNull:false
    }   
})
module.exports=group