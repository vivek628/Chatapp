const {DataTypes}= require('sequelize')
const sequelize= require('../utils/db')
const Group = require('./group')
const User=require('./User')
const groupmsg=sequelize.define('GroupMsg',{
    
        groupmsg: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        groupId: { // Consistent naming
          type: DataTypes.INTEGER,
          references: {
            model: Group,
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        userId: { // Add userId if you want to associate messages with users
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        }
         
})
module.exports=groupmsg