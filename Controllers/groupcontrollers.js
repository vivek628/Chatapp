const Group=require('../models/group')
const User=require('../models/User')
const groupmsg=require('../models/groupchat')
const path=require('path');
const { where } = require('sequelize');
exports.creategroup = async (req, res, next) => {
  try {
    const groupname = req.query.groupname;
    const selectedUsers = req.query.members; 

   
    const group = await Group.create({ groupname });

   
    const users = await User.findAll({
      where: {
        username: selectedUsers 
      }
    });
    console.log(users)

  
    await group.addUsers(users); 

    res.status(201).json({ message: 'Group created and users added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the group' });
  }
};

exports.groups = (req, res, next) => {
    console.log("Serving groups page");
    const filePath = path.join(__dirname, '..', 'public/views/groups.html');
    console.log(filePath)
    res.sendFile(path.join(__dirname, '..', 'public/views/groups.html'));
};
exports.getallgroup = async (req, res, next) => {
  console.log(req.user)
  const userid=req.user.id
   
    
      try{
        const user = await User.findByPk(userid, {
          include: {
            model: Group,
            through: {
              attributes: [] 
            }
          }
        });
        console.log(user.Groups)
        res.json({groups:user.Groups})

      }
       

     catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'An error occurred while fetching groups' });
    }
};
exports.members=async(req,res,next)=>{
     const groupid=req.query.groupid
     console.log("groupid",groupid)
     try{
      const member = await Group.findByPk(groupid, {
        include: {
          model: User,
        
        }
      });
   
     console.log(member.users)
      const usernames = member.users.map(user => user.username);
      console.log(usernames)
      res.json({groups:usernames})

    }
    catch(e){
      console.log("err in member ",e)
    }
}
exports.groupmsg=async(req,res,next)=>{
  const userid=req.user.id
  const groupid=req.body.groupid
  const msg=req.body.msg
  console.log("nsg is ",msg)
  await groupmsg.create({groupmsg:msg,userId:userid,groupid:groupid})
  res.json({message:"ok"})
}
exports.getgroupmsg=async(req,res,next)=>{
  const groupid= req.query.groupid
  const msgs=await groupmsg.findAll({where:{groupid:groupid}})
  console.log(msgs)
  res.json({msgs:msgs})
}