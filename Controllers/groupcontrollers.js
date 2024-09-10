const Group=require('../models/group')
const User=require('../models/User')
const groupmsg=require('../models/groupchat')
const path=require('path');
const { where } = require('sequelize');
const usergroup = require('../models/usergroup');
exports.creategroup = async (req, res, next) => {
  try {
   
    const defaultadmin = req.user.id;
    const groupname = req.query.groupname;
    const selectedUsers = req.query.members;
   

    
    const group = await Group.create({ groupname: groupname });
    
    const users = await User.findAll({
      where: {
        username: selectedUsers
      }
    });
    console.log("Users fetched", users);

    
    for (const member of selectedUsers) {
     
      const getmember = await User.findOne({
        where: { username: member },
        attributes: ['id']
      });

      if (getmember) {
        const userId = getmember.id;
        const role = userId === defaultadmin ? 'admin' : 'member';

      
        await usergroup.create({
          userId: userId,
          groupId: group.id,
          role: role
        });
      } else {
        console.log(`User with username ${member} not found`);
      }
    }

    console.log("Users added to group");

   
    await usergroup.update(
      { role: 'admin' },
      { where: { userId: defaultadmin, groupId: group.id } }
    );

    console.log("Admin role updated");

    res.status(201).json({ message: 'Group created and users added successfully' });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'An error occurred while creating the group' });
  }
};



exports.groups = (req, res, next) => {
    console.log("Serving groups page");
    const filePath = path.join(__dirname, '..', 'public/views/groups.html');
  
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
     const selfid=req.user.id
     console.log("groupid",groupid)
     try{
      const member = await Group.findByPk(groupid, {
        include: {
          model: User,
        
        }
      });
      const admins=await usergroup.findAll({where:{groupId:groupid,role:'admin'},attributes:['userId']})
   
      const adminlist=admins.map(admin=>admin.userId)
      

      const isadmin=adminlist.includes(selfid)
     

       
    
      const usernames = member.users.map(user => user.username);
      const userid = member.users.map(user => user.id);
     
      res.json({groups:usernames,isAdmin:isadmin})

    }
    catch(e){
      console.log("err in member ",e)
    }
}
exports.groupmsg=async(req,res,next)=>{
  const userid=req.user.id
  const groupid=req.body.groupid
  
  const msg=req.body.msg
 
  await groupmsg.create({groupmsg:msg,userId:userid,groupId:groupid})
  res.json({message:"ok"})
}
exports.getgroupmsg=async(req,res,next)=>{
  const groupid= req.query.groupid
  const msgs=await groupmsg.findAll({where:{groupid:groupid}})

  res.json({msgs:msgs})
}
exports.notadmin = async (req, res, next) => {
  try {
    const groupid = req.query.groupid;
   
    
    
    const notadminRecords = await usergroup.findAll({
      where: { role: 'member', groupId: groupid },
      attributes: ['userId']
    });
   
    
    
    const notadminIds = notadminRecords.map(record => record.userId);
   
    
  
    const notadminUsers = await User.findAll({
      where: { id: notadminIds },
      attributes: ['username']
    });
    
    
   
    const usernameArray = notadminUsers.map(user => user.username);
    
    
  
    res.json({ msg: "ok", usernames: usernameArray });
  } catch (error) {
    
    console.error("Error fetching data", error);
    res.status(500).json({ msg: "Error fetching data", error: error.message });
  }
};
exports.creatadmin=async(req,res,next)=>{

  const selected=req.query.members
  const names_to_ids=await User.findAll({where:{username:selected},attributes:['id']})
  const ids=names_to_ids.map(e=>e.id)
  await usergroup.destroy({where:{userId:ids}})
  res.json({msg:"ok"})
}