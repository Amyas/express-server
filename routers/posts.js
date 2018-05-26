const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const createToken = require('../middleware/createToken')
const checkToken = require('../middleware/checkToken')
const User = require('../models/User')
const Posts = require('../models/Posts')
const jwt = require('jsonwebtoken')
const config = require('../config')

//*获取课程列表
router.get('/list', checkToken, async (req, res, next) => {
    const list = await Posts
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

//*创建文章
router.post('/create', checkToken, async (req, res, next) => {
    const {title,content} = req.body

    //获取当前用户
    let token = req.headers['token']
    let decode = jwt.decode(token, config.tokenSecret)

    const user = await User
        .findOne({username:decode.name})
        .catch(e => {
            res.status(500).json({
                message: e.message
            })
            return
        })
    
    //创建文章
    const posts = new Posts({
        user_id:user._id,
        title,
        content,
    })

    //将文章添加到数据库中
    await posts
        .save()
        .catch(e => {
            res.status(500).json({
                message: e.message
            })
            return
        })
    
    res.json({
        code: 201,
        message: '创建成功'
    })
})
module.exports = router