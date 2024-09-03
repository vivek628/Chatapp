const path=require('path')
const User= require('../models/User')
const Message=require('../models/messages')
const jwt=require('jsonwebtoken')
const { where } = require('sequelize')
const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.home=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public/views/signup.html'))
   
}
exports.postsignup=async(req,res,next)=>{
    try{
     
        const {username,email,password,number}=req.body
      

       const userexist=await User.findOne({where:{email:email}})
        if(userexist)
        {
           return  res.status(400).json({message:"User already exists, Please Login"})
        }
        const hashpass=await  bcrypt.hash(password,saltRounds)
        await User.create({
            username:username,email:email,password:hashpass,mobileNumber:number
        })
       
        res.status(201).json({message:"USER SIGNUP SUCCESSFULLY"})

    }
    catch(e){
        console.log("something went wrong in signup ")
        console.log("err in signup is ",e)
        res.status(500).json({ message: "Internal Server Error" });
    }
 
}
exports.getlogin=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','/public/views/login.html'))
}
exports.postlogin=async(req,res,next)=>{
    try{
      const {email,password}=req.body
      const user= await User.findOne({where:{email:email}})
      if(user!=undefined)
      {
       const ismatch=await bcrypt.compare(password,user.password)
       if(ismatch)
       { 
        const token= jwt.sign({ id: user.id, email: user.email }, process.env.MY_SECRET_KEY)
        res.status(200).json({message:"LOGIN SUCCESSFUL",token:token})
       }
       else{
        res.status(401).json({message:"PASSWORD DOES NOT MATCH"})
       }
      }
      else{
        res.status(404).json({message:"USER DOES NOT EXIST"})
      }
      
    }
    catch(e)
    {
        console.log("somthing went wrong")
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}
exports.display=(req,res,next)=>{
    try{
        
        res.sendFile(path.join(__dirname,'..','public/views/chatdisplay.html'))
    }
    catch(e){
        console.log("err in display",e)
    }

}
exports.users=async(req,res,next)=>{
    try{
        const current_user=req.user.id
        const users= await User.findAll()
        const filteredUsers = users.filter(user => user.id !== current_user);
        res.status(201).json({users:filteredUsers})
    }
    catch(e){
        console.log(e)
    }
}
exports.sendmessage=async(req,res,next)=>{
    try{
        const { to, message } = req.body;

        console.log('Recipient:', to);
        console.log('Message:', message);
        console.log(req.user)
        
        const reciever= await User.findOne({where:{username:to}})
        const  reciever_id=reciever.id
        await Message.create({sender_id:req.user.id,reciever_id:reciever_id,message:message})
        res.json({message:'ok'})
    }
    catch(E)
    {
        console.log("err in ",E)
    }
    
}
exports.msg=async (req,res,next)=>{
    try{
        const sender=req.user
        const to=req.query.to
        console.log(to)
        console.log("sender is ",sender)
        const sender_msgs= await Message.findAll({where:{sender_id:sender.id}})
        const reciever_msg= await Message.findAll({where:{reciever_id:to}})
      // console.log(sender_msgs)
        console.log(reciever_msg)
        res.json({sender_msgs:sender_msgs,reciever_msg:reciever_msg})
    }
    catch(e)
    {
        console.log(e)
    }
}