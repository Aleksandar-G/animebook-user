const {
  createUser,
  changePassword,
  deleteUser,
  checkUser,
} = require("../services/userService");
const rabbitmq = require("../rabbitmq");

const login = (channel, username, password) => {
  return checkUser(username, password).then((user) => {
    if (!user) return null;
    const rpcMessage = JSON.stringify({
      username: username,
      userId: user.id,
    });
    return rabbitmq
      .sendRPCRequest(channel, rpcMessage, rabbitmq.Generatequeue)
      .then((token) => {
        if (user) {
          return token;
        } else {
          return null;
        }
      });
  });
};

const register = (channel, username, email, password) => {
  return createUser(username, email, password).then((user) => {
    if (user === "email or username exists") return "email or username exists";
    const rpcMessage = JSON.stringify({ username: username, userId: user.id });
    return rabbitmq
      .sendRPCRequest(channel, rpcMessage, rabbitmq.Generatequeue)
      .then((token) => {
        if (user && token) {
          return token;
        } else {
          return null;
        }
      });
  });
};

exports.login = login;
exports.register = register;
