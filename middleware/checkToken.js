const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = function (req, res, next) {
    let token = req.headers['token']
    let decode;
    try {
        decode = jwt.decode(token, config.tokenSecret)
        if(!decode) throw new Error('token不存在')
    } catch (e) {
        return res.status(401).json({
            message: e.message
        })
    }

    //token验证
    if (token && decode.exp <= Date.now() / 1000) {
        return res.status(401).json({
            code:401,
            message: 'token过期，请重新登录'
        })
    }
    next()
}