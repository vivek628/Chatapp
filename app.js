const express= require('express')
const bodyparser= require('body-parser')
const signuproute=require('./Routes/signupRoute')
const grouproute=require('./Routes/groupRoute')
require('dotenv').config();

const app=express()
const cors=require('cors')
const corsoptions={
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE'
}
app.use(cors(corsoptions))
app.use(bodyparser.urlencoded({extended:true}))

app.use(bodyparser.json());
const users=require('./models/User')
const messages= require('./models/messages')
const group=require('./models/group')
const groupmsg=require('./models/groupchat')
const path= require('path')
const sequelize = require('./utils/db')
const PORT= process.env.PORT||5000

users.hasMany(messages,{
  foreignKey: 'senderId'

})
messages.belongsTo(users,{
  foreignKey: 'senderId'

})
users.hasMany(messages,{
  foreignKey: 'receiverId'

})
messages.belongsTo(users,{
  foreignKey: 'receiverId'

})
group.belongsToMany(users,{through:'UserGroups'})
users.belongsToMany(group,{through:'UserGroups'})
users.hasMany(groupmsg, { foreignKey: 'userId' });
groupmsg.belongsTo(users,{foreignKey: 'userId'})
group.hasMany(groupmsg, { foreignKey: 'userId' });
groupmsg.belongsTo(group, { foreignKey: 'userId' });
app.use(express.static('public'))
//app.use(express.static(path.join(__dirname, 'public')));

app.use(signuproute)
app.use(grouproute)
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

