const express = require('express')
const User = require('../models/User')
const createToken = require('../middleware/createToken')

module.exports = function (app) {
    //管理台
    app.use('/api/admin', async (req, res, next) => {
        //登录
        app.post('/login', async (req, res, next) => {
            const { username, password } = req.body

            try {
                if (!username) {
                    throw new Error('请输入账号')
                }
                if (!password) {
                    throw new Error('请输入密码')
                }
            } catch (e) {
                res.status(422).json({
                    code: 422,
                    message: e.message
                })
            }

            const userInfo = await User
                .findOne({ username, password })
                .catch(e => {
                    res.status(500).send(e)
                    return
                })

            if (!userInfo) {
                res.status(404).json({
                    code: 404,
                    message: '账号或密码错误'
                })
                return
            }

            res.json({
                code: 200,
                message: '获取成功',
                data: {
                    userInfo: {
                        ...userInfo._doc,
                        token: createToken(username)
                    }
                }
            })
        })

        next()
    })
    app.use('/api/admin/user', require('./admin/user'))
    app.use('/api/admin/posts', require('./admin/posts'))



    //前端
    app.use('/api/front/home', require('./front/home'))
    app.use('/api/front/posts', require('./front/posts'))
}