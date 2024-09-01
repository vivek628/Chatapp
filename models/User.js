const {DataTypes}= require('sequelize')
const sequelize=require('../utils/db')
const User= sequelize.define('user',{
    username:{
        type:DataTypes.STRING,
        AllowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures that email addresses are unique
        validate: {
          isEmail: true, 
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    })
    module.exports=User

