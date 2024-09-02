const express= require('express')
const bodyparser= require('body-parser')
const signuproute=require('./Routes/signupRoute')
require('dotenv').config();
const app=express()
const cors=require('cors')
const corsoptions={
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE'
}
app.use(cors(corsoptions))
app.use(bodyparser.urlencoded({extended:true}))

app.use(bodyparser.json());

const path= require('path')
const sequelize = require('./utils/db')
const PORT= process.env.PORT||5000


app.use(express.static('public'))
app.use(signuproute)
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

