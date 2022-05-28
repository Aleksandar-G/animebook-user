const validEmail = (email) => {
  const emailRex = new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

  return emailRex.test(email);
};

const validPassword = (password) => {
  const passwordRex = new RegExp(
    "^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{9,36}$"
  );

  return passwordRex.test(password);
};

exports.validEmail = validEmail;
exports.validPassword = validPassword;
