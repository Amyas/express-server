const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = function (name) {
    const token = jwt.sign(
        { name },
        config.tokenSecret,
        { expiresIn: config.tokenExpires }
    )
    return token
}