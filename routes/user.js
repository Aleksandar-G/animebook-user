const express = require("express")
const router = express.Router()
const { createUser, changePassword, deleteUser, checkUser } = require("../controllers/userController")
const rabbitmq = require('../rabbitmq')

//connect to rabbitmq

// queues to connect to 
const Verifyqueue = 'verify_auhtentication_queue'
const Generatequeue = 'generate_auhtentication_queue'

let channel;

rabbitmq.rabbitMQChannel()
    .then((ch) => {
        channel = ch
    })

//login
router.get('/', (req, res) => {

    const username = req.body.username
    const password = req.body.password

    checkUser(username, password).then((userExists) => {
        if (userExists) {
            res.status(200)
            res.send('ok')
        } else {
            res.status(401)
            res.send("not authenticated")
        }
    })
})

//register
router.post('/', (req, res) => {

    createUser(req.body.username, req.body.email, req.body.password).then((created) => {

        rabbitmq.sendRPCRequest(channel, req.body.username, Generatequeue)
            .then((token) => {
                if (created && token) {
                    res.status(201)
                    res.send({ token: token })
                } else {
                    res.status(500)
                }
            })
    })
})

//delete user
router.delete('/', (req, res) => {
    deleteUser(req.body.username).then((deleted) => {
        if (deleted) {
            res.status(200)
            res.send("deleted")
        } else {
            res.status(500)
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
