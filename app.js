const express= require('express')
const bodyparser= require('body-parser')
const signuproute=require('./Routes/signupRoute')
const app=express()
const cors=require('cors')
const corsoptions={
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE'
}
app.use(cors(corsoptions))
app.use(bodyparser.urlencoded({extended:true}))

app.use(bodyparser.json());
require('dotenv').config();
const path= require('path')
const PORT= process.env.PORT||5000


app.use(express.static('public'))
app.use(signuproute)
app.listen(PORT,()=>{
    console.log("server is running")
})
