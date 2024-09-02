const express= require('express')
const path= require('path')
const route= express.Router()
const {home,postsignup,getlogin,postlogin,display,users}= require('../Controllers/signupController')
route.get('/',home)
    
route.post('/signup',postsignup)
route.get('/getlogin',getlogin)
route.post('/postlogin',postlogin)
route.get('/display',display)
route.get('/users',users)

module.exports=route