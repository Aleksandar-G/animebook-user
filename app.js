require('dotenv').config()
const express = require('express');
const { database } = require('./utils/database')
const userRouter = require("./routes/user")



//start server
const app = express()

app.use(express.json())

//routers
app.use('/', userRouter)

module.exports = app