const path=require('path')

const { where } = require('sequelize')
const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.home=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public/views/signup.html'))
}
exports.postsignup=async(req,res,next)=>{
    try{
        console.log(req)
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