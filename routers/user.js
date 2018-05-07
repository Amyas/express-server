const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const createToken = require('../middleware/createToken')
const checkToken = require('../middleware/checkToken')
const User = require('../models/User')

//*获取用户详情
router.get('/', checkToken, async (req, res, next) => {
    if (!req.query.id) {
        res.json({
            code: 400,
            message: '请输入用户id'
        })
        return
    }
    const user = await User.
        findById(req.query.id, { password: 0, token: 0 })
        .catch(e => {
            res.json({
                code: 500,
                message: e.message
            })
            return
        })
    res.json({
        code: 200,
        message: '获取成功',
        data: {
            user
        }
    })
})

//*获取用户列表
router.get('/list', checkToken, async (req, res, next) => {
    //返回所有数据，但不包括password，token字段
    const list = await User
        .find({}, { password: 0, token: 0 })
        .catch(e => {
            res.json({
                code: 500,
                message: e.message
            })
            return
        })
    res.json({
        code: 200,
        message: '获取成功',
        data: {
            list
        }
    })
})

//*创建用户
router.post('/create', async (req, res, next) => {
    const {
        username,
        password,
        repassword
    } = req.body

    //校验参数
    try {
        if (!username) {
            throw new Error('请输入用户名！')
        }
        if (!password) {
            throw new Error('请输入密码！')
        }
        if (password !== repassword) {
            throw new Error('两次密码输入不一致！')
        }
        const user = await User.findOne({ username })
        if (user) {
            throw new Error('当前用户名重复！')
        }
    } catch (e) {
        res.json({
            code: 400,
            message: e.message
        })
        return
    }

    //创建用户
    const user = new User({
        username,
        password,
        token: createToken(username)
    })

    //将用户添加到数据库中
    await user
        .save()
        .catch(e => {
            res.json({
                code: 500,
                message: e.message
            })
            return
        })

    res.json({
        code: 201,
        message: '创建成功',
        data: {
            user
        }
    })

})

//*删除用户
router.post('/delete', checkToken, async (req, res, next) => {
    const { username } = req.body

    //校验参数
    const user = await User
        .findOne({ username })
        .catch(e => {
            res.json({
                code: 500,
                message: e.message
            })
            return
        })
    if (!user) {
        res.json({
            code: 404,
            message: '当前用户不存在'
        })
        return
    }

    await User
        .remove({ username })
        .catch(e => {
            res.json({
                code: 500,
                message: e.message
            })
            return
        })

    res.json({
        code: 204,
        message: '删除成功！'
    })
})

//*更新用户
router.post('/update', checkToken, async (req, res, next) => {
    const { username } = req.body
    delete req.body.username

    const user = await User
        .updateOne({ username }, req.body)
        .catch(e => {
            res.json({
                code: 500,
                message: e.message
            })
        })
    res.json({
        code: 201,
        message: '修改成功！'
    })
})

module.exports = router