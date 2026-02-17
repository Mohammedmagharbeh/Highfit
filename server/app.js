const express=require('express') 
const bodyParse=require('body-parser')
const cors=require('cors')
const dotenv=require('dotenv')
const connectDB=require('./config/db')


dotenv.config()
const app=express();
connectDB();

app.use(bodyParse.json())
app.use(cors());

module.exports=app; 