const express = require('express');
const http=require('http')
const {Server}=require('socket.io')

const bodyparser = require('body-parser');
const signuproute = require('./Routes/signupRoute');
const grouproute = require('./Routes/groupRoute');
require('dotenv').config();

const app = express();
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:8000',
  methods: 'GET,POST,PUT,DELETE'
};

app.use(cors(corsOptions));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


const User = require('./models/User');
const Message = require('./models/messages');
const Group = require('./models/group');
const GroupChat = require('./models/groupchat');
const UserGroups = require('./models/usergroup');
const archievechat=require('./models/archievechat')


User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

User.hasMany(Message, { foreignKey: 'receiverId' });
Message.belongsTo(User, { foreignKey: 'receiverId' });

Group.belongsToMany(User, { through: UserGroups, foreignKey: 'groupId' });
User.belongsToMany(Group, { through: UserGroups, foreignKey: 'userId' });

User.hasMany(GroupChat, { foreignKey: 'userId' });
GroupChat.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(GroupChat, { foreignKey: 'groupId' });
GroupChat.belongsTo(Group, { foreignKey: 'groupId' });

app.use(express.static('public'));


app.use(signuproute);
app.use(grouproute);


const sequelize = require('./utils/db');
const PORT = process.env.PORT || 5000;
require('./chrone')
const server=http.createServer(app)
const io= new Server(server)
io.on('connection',(socket)=>{
  
  socket.on('user-message',(message)=>{
    io.emit('message',message)
  })
})
sequelize.sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
