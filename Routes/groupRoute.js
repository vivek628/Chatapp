const express= require('express')
const route= express.Router()
const {creategroup,groups,getallgroup,members,groupmsg,getgroupmsg,notadmin,creatadmin}=require('../Controllers/groupcontrollers')

const { userid } = require('../middleware/jwtMiddleware');
route.get('/creategroup',userid,creategroup)
route.get('/groups',groups)
route.get('/getallgroup',userid,getallgroup)
route.get('/members',userid,members)
route.post('/sendgroupmsg',userid,groupmsg)
route.get('/getgroupmsg',getgroupmsg)
route.get('/notadmin',notadmin)
route.get('/creatadmin',creatadmin)
module.exports=route
