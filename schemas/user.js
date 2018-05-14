const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    nickname: String,
    username: String,
    password: String,
})