const express= require('express')
const path= require('path')
const route= express.Router()
const {home,postsignup}= require('../Controllers/signupController')
route.get('/',home)
    
route.post('/signup',postsignup)
module.exports=route