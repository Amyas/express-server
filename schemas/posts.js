const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    user_id: String,
    user_nickname: String,
    title: String,
    content: String,
    create_date: Number,
    update_date: Number,
})