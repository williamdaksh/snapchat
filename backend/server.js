const express = require('express');
const cors = require('cors')
const { connection } = require('mongoose');
const router = require('./routes/authRoutes');
const connectDB = require('./config/database');
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth',router)


connectDB()

app.listen('5000',()=>{
    console.log("server is start port in 5000")
})