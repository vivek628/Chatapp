const {DataTypes} =require('sequelize')
const sequelize=require('../utils/db')
const usergroup= sequelize.define('usergroup',
    {
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users', // This should match the name of the User model
            key: 'id'      // This specifies that the foreign key references the 'id' column in the Users table
          }
        },
        groupId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Groups', // This should match the name of the Group model
            key: 'id'      // This specifies that the foreign key references the 'id' column in the Groups table
          }
        },
        role: {
          type: DataTypes.ENUM('admin', 'member'),
          defaultValue: 'member'
        },
    
})
module.exports=usergroup