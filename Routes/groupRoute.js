const express= require('express')
const route= express.Router()
const {creategroup,groups,getallgroup,members,groupmsg,getgroupmsg}=require('../Controllers/groupcontrollers')

const { userid } = require('../middleware/jwtMiddleware');
route.get('/creategroup',creategroup)
route.get('/groups',groups)
route.get('/getallgroup',userid,getallgroup)
route.get('/members',members)
route.post('/sendgroupmsg',userid,groupmsg)
route.get('/getgroupmsg',getgroupmsg)
module.exports=route
