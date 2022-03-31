const { User } = require("../models/")

export const createUser = (username, email, password) => {
    User.create({ username, email, password }).then(() => {
        return true
    }).catch((err) => {
        console.log(err);
        return false
    })
}

export const changePassword = (newPassword) => {
    User.update({ password: newPassword }).then(() => {
        return true
    }).catch((err) => {
        console.log(err);
        return false
    })
}

export const deleteUser = (username) => {
    User.destroy({
        where: {
            username: username
        }
    }
    )
}