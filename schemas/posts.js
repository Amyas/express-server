const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    user_id: String,
    title: String,
    content: String,
})