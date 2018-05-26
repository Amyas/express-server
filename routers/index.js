const express = require('express')
const User = require('../models/User')
const createToken = require('../middleware/createToken')

//参数验证错误=422
//数据不存在=404

module.exports = function (app) {
    let minaData = '';
    //登录
    app.post('/api/login', async (req, res, next) => {
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
                userInfo:{
                    ...userInfo._doc,
                    token:createToken(username)
                }
            }
        })
    })

    app.use('/api/user', require('./user'))
    app.use('/api/posts', require('./posts'))

    app.post('/mina',async(req,res,next)=>{
        minaData = req.body
        res.send('ok')
    })

    app.get('/mina',async(req,res,next)=>{
        res.json({
            data:minaData
        })
    })
}