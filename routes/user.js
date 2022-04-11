const express = require("express")
const router = express.Router()
const { createUser, changePassword, deleteUser, checkUser } = require("../services/userService")
const { login, register } = require('../controllers/userController')
const rabbitmq = require('../rabbitmq')

//connect to rabbitmq
let channel;

rabbitmq.rabbitMQChannel()
    .then((ch) => {
        channel = ch
    })

//login
router.get('/', (req, res) => {

    const username = req.body.username
    const password = req.body.password


    login(channel, username, password).then((token) => {
        console.log(token);
        if (token === null) {
            res.status(401)
            res.send("not authenticated")
        } else {
            res.send({ token: token })
        }
    })

})

//register
router.post('/', (req, res) => {

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    register(channel, username, email, password).then((token) => {
        if (token) {
            res.status(201)
            res.send({ token: token })
        } else {
            res.status(500)
        }
    })
})

//delete user
router.delete('/', (req, res) => {

    const rpcMessage = { "token": req.headers.authorization, "username": req.body.username }

    rabbitmq.sendRPCRequest(channel, rpcMessage, Verifyqueue)
        .then((verified) => {

            if (!verified) {
                res.status(401)
                res.send("not authenticated")

            } else {
                deleteUser(req.body.username).then((deleted) => {
                    if (deleted) {
                        res.status(200)
                        res.send("deleted")
                    } else {
                        res.status(500)
                    }
                })
            }


        })


})

//change password
router.put('password', (req, res) => {
    changePassword(req.body.newPassword).then(() => {
        if (passwordChagned) {
            res.status(200)
            res.send("password changed")
        } else {
            res.status(500)
        }
    })


})


module.exports = router
