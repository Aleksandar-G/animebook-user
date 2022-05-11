require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { database } = require("./utils/database");
const userRouter = require("./routes/user");

//start server
const app = express();

app.use(express.json());

//enable cors
app.use(cors());

//cookies
app.use(cookieParser());

//routers
app.use("/user", userRouter);

module.exports = app;
