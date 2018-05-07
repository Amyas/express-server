const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = function (req, res, next) {
    let token = req.headers['token']
    let decoed = jwt.decode(token, config.tokenSecret)
    //token不存在||token错误
    if (!token || !decoed) {
        return res.json({
            code: 401,
            message: '非法请求'
        })
    }
    //token验证
    if (token && decoed.exp <= Date.now() / 1000) {
        return res.json({
            code: 401,
            message: 'token过期，请重新登录'
        })
    }
    next()
}