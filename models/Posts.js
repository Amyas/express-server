const mongoose = require('mongoose')
const PostsSchema = require('../schemas/posts')

module.exports = mongoose.model('Posts', PostsSchema)