const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    token: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})