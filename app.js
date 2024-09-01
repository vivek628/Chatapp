const express= require('express')
const bodyparser= require('body-parser')
const signuproute=require('./Routes/signupRoute')
const app=express()
app.use(bodyparser.urlencoded({extended:true}))
require('dotenv').config();
const path= require('path')
const PORT= process.env.PORT||5000


app.use(express.static('public'))
app.use(signuproute)
app.listen(PORT,()=>{
    console.log("server is running")
})
