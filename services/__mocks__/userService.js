const userService = jest.createMockFromModule("../userService");

async function createUser (username,email,password) {
    return Promise.resolve(true)
}

async function deleteUser (username) {
    return Promise.resolve(true)
}

async function checkUser (username, password){
    return Promise.resolve(true)
}

async function changePassword (username,newPassword){
    return Promise.resolve(true)
}


userService.createUser = createUser
userService.deleteUser = deleteUser
userService.checkUser = checkUser
userService.changePassword = changePassword

module.exports = userService