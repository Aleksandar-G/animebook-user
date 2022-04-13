const User = jest.createMockFromModule("../User");

async function createUser (username,email,password) {
    return Promise('resolve', true)
}

function test (username,email,password) {
    console.log("test");
}

User.createUser = createUser
User.test = test

module.exports = User