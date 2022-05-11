const bcrypt = require("bcrypt");
const { User } = require("../models");

const saltRounds = 10;

const createUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt(saltRounds);

  return bcrypt.hash(password, salt).then((hash) => {
    return User.create({ username: username, email: email, password: hash })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  });
};

const checkUser = async (username, password) => {
  const user = await User.findOne({ where: { username: username } });

  if (user === null) return null;

  return bcrypt.compare(password, user.password).then((comparePassword) => {
    if (comparePassword) {
      return user;
    } else {
      return null;
    }
  });
};

const changePassword = async (newPassword) => {
  const hash = await bcrypt.hash(newPassword, saltRounds);

  return User.update({ password: hash })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const deleteUser = async (username) => {
  return User.destroy({
    where: {
      username: username,
    },
  });
};

exports.createUser = createUser;
exports.changePassword = changePassword;
exports.deleteUser = deleteUser;
exports.checkUser = checkUser;
