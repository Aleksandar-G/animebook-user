const axios = require("axios");

const generateJWT = async (username, userId) => {
  return await axios.post(
    "https://europe-west1-fast-nexus-346709.cloudfunctions.net/generateJWT",
    { username: username, userId: userId }
  );
};

const verifyJWT = async (token) => {
  return await axios.post(
    "https://europe-west1-fast-nexus-346709.cloudfunctions.net/verifyJWT",
    { token: token }
  );
};

exports.generateJWT = generateJWT;
exports.verifyJWT = verifyJWT;
