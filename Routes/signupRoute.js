const express= require('express')
const path= require('path')
const route= express.Router()

const {home,postsignup,getlogin,postlogin,display,users,sendmessage,msg}= require('../Controllers/signupController')

const { userid } = require('../middleware/jwtMiddleware');

route.get('/',home)    
route.post('/signup',postsignup)
route.get('/getlogin',getlogin)
route.post('/postlogin',postlogin)
route.get('/display',display)
route.get('/users',userid,users)
route.post('/sendMessage',userid,sendmessage)
route.get('/msg',userid,msg)


module.exports=route