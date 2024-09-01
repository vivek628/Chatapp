const path=require('path')
const User= require('../models/User')
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