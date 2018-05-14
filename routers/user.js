const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const createToken = require('../middleware/createToken')
const checkToken = require('../middleware/checkToken')
const User = require('../models/User')

//*获取用户列表
router.get('/list', checkToken, async (req, res, next) => {
    const list = await User
        .find()
        .catch(e => {
            res.status(500).send(e.message)
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
router.post('/create', checkToken, async (req, res, next) => {
    const {
        nickname,
        username,
        password,
    } = req.body

    //校验参数
    try {
        if (!username) {
            throw new Error('请输入用户名！')
        }
        if (!password) {
            throw new Error('请输入密码！')
        }
        const user = await User.findOne({ username })
        if (user) {
            throw new Error('当前账号重复！')
        }
    } catch (e) {
        res.status(400).json({
            message: e.message
        })
        return
    }

    //创建用户
    const user = new User({
        nickname,
        username,
        password,
        token: createToken(username)
    })

    //将用户添加到数据库中
    await user
        .save()
        .catch(e => {
            res.status(500).json({
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
router.post('/remove', checkToken, async (req, res, next) => {
    const { _id } = req.body

    //校验参数
    const user = await User
        .findById({ _id })
        .catch(e => {
            res.status(500).json({
                message: e.message
            })
            return
        })
    if (!user) {
        res.status(404).json({
            message: '当前用户不存在'
        })
        return
    }

    await User
        .remove({ _id })
        .catch(e => {
            res.status(500).json({
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
    try {
        const userInfo = await User
            .find({ username })
            .catch(e => {
                return res.status(500).json({
                    message: e.message
                })
            })
        if (!userInfo) {
            throw new Error('该账号不存在')
        }
        if(userInfo.length > 1){
            throw new Error('账号重复')
        }
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }

    const user = await User
        .updateOne({ _id: req.body._id }, req.body)
        .catch(e => {
            res.status(500).json({
                message: e.message
            })
        })
    res.json({
        code: 201,
        message: '修改成功!'
    })
})

module.exports = router