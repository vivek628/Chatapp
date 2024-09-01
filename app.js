const express= require('express')
const bodyparser= require('body-parser')
require('dotenv').config();
const path= require('path')
const PORT= process.env.PORT||5000
const app=express()
app.use(express.static('public'))
app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'public/views/signup.html'))
})
app.listen(PORT,()=>{
    console.log("server is running")
})
