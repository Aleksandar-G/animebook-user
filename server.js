const express = require('express')
const { Sequelize } = require('sequelize');
const userRouter = require("./routes/user")

//Connect to databse
const sequelize = new Sequelize('userdb', 'user', 'password', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});
sequelize.authenticate().then(() => {
    console.log("good job");
}).catch((err) => { console.log(err); })

//start server
const app = express()

app.use(express.json())

app.listen(3000, () => {
    console.log("Listening on port 3000!")
});

//routers
app.use('/', userRouter)
