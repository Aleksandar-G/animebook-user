const { createUser, changePassword, deleteUser, checkUser } = require("../services/userService")
const rabbitmq = require('../rabbitmq')

// queues to connect to 
const Verifyqueue = 'verify_auhtentication_queue'
const Generatequeue = 'generate_auhtentication_queue'

const login = (channel, username, password) => {
    return checkUser(username, password).then(userExists =>
        rabbitmq.sendRPCRequest(channel, username, Generatequeue).then(token => {
            if (userExists) {
                return token
            } else {
                return null
            }
        })
    )
}

const register = (channel, username, email, password) => {

    return createUser(username, email, password).then(created =>
        rabbitmq.sendRPCRequest(channel, username, Generatequeue)
            .then((token) => {
                if (created && token) {
                    return token
                } else {
                    return null
                }
            })
    )
}


exports.login = login
exports.register = register

