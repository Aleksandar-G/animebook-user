const express = require("express");
const router = express.Router();
const {
  createUser,
  changePassword,
  deleteUser,
  checkUser,
} = require("../services/userService");
const { validEmail, validPassword } = require("../utils/validateData");
const { login, register } = require("../controllers/userController");
const rabbitmq = require("../rabbitmq");

//connect to rabbitmq
let channel;

rabbitmq.rabbitMQChannel().then((ch) => {
  channel = ch;
});

//login
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  login(channel, username, password).then((token) => {
    if (token === null) {
      res.status(401);
      res.send("not authenticated");
    } else {
      res.cookie("token", token);
      res.send({
        username: username,
        token: token,
      });
    }
  });
});

//register
router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!validEmail(email)) {
    res.status(400);
    res.send("email is not valid");
  }

  if (!validPassword(password)) {
    res.status(400);
    res.send("password in not valid");
  }
  register(channel, username, email, password).then((token) => {
    if (token) {
      if (token === "email or username exists") {
        res.status(400);
        res.send("email or username exists");
      } else {
        res.cookie("token", token);
        res.status(201);
        res.send({
          username: username,
          token: token,
        });
      }
    } else {
      res.status(500);
    }
  });
});

//delete user
router.delete("/delete", (req, res) => {
  const rpcMessage = {
    token: req.headers.authorization,
    username: req.body.username,
  };

  rabbitmq.sendRPCRequest(channel, rpcMessage, Verifyqueue).then((verified) => {
    if (!verified) {
      res.status(401);
      res.send("not authenticated");
    } else {
      deleteUser(req.body.username).then((deleted) => {
        if (deleted) {
          res.status(200);
          res.send("deleted");
        } else {
          res.status(500);
        }
      });
    }
  });
});

//change password
router.put("/password", (req, res) => {
  changePassword(req.body.newPassword).then(() => {
    if (passwordChagned) {
      res.status(200);
      res.send("password changed");
    } else {
      res.status(500);
    }
  });
});

module.exports = router;
