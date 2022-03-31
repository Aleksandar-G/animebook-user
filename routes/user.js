const express = require("express")
const router = express.Router()
const { createUser, changePassword, deleteUser } = require("../controllers/userController")

//create a new user
router.post('/', (req, res) => {

    const created = createUser(req.body.username, req.body.email, req.body.password)

    if (created) {
        res.status(201)
        res.send("saved")
    } else {
        res.status(500)
    }

})


//delete user
router.delete('/', (req, res) => {
    const deleted = deleteUser(req.body.username)

    if (deleted) {
        res.status(200)
        res.send("deleted")
    } else {
        res.status(500)
    }
})

//change password
router.put('password', (req, res) => {
    const passwordChanged = changePassword(req.body.newPassword)

    if (passwordChagned) {
        res.status(200)
        res.send("password changed")
    } else {
        res.status(500)
    }
})


module.exports = router
