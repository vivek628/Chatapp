const express= require('express')
const path= require('path')
const route= express.Router()
const {home,postsignup,getlogin,postlogin}= require('../Controllers/signupController')
route.get('/',home)
    
route.post('/signup',postsignup)
route.get('/getlogin',getlogin)
route.post('/postlogin',postlogin)
module.exports=route