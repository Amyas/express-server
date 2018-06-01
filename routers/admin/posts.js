const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const createToken = require('../../middleware/createToken')
const checkToken = require('../../middleware/checkToken')
const User = require('../../models/User')
const Posts = require('../../models/Posts')
const jwt = require('jsonwebtoken')
const config = require('../../config')

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
    const { title, content } = req.body

    //获取当前用户
    let token = req.headers['token']
    let decode = jwt.decode(token, config.tokenSecret)

    const user = await User
        .findOne({ username: decode.name })
        .catch(e => {
            res.status(500).json({
                message: e.message
            })
            return
        })

    //创建文章
    const posts = new Posts({
        user_id: user._id,
        user_nickname: user.nickname,
        title,
        content,
        create_date: new Date().getTime(),
        update_date: new Date().getTime()
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

//*删除文章
router.get('/remove', checkToken, async (req, res, next) => {
    const { id } = req.query

    try {
        const posts = await Posts.findByIdAndRemove(id)
        if (!posts) {
            throw new Error('没有找到该文章！')
        }
        res.json({
            message: "删除成功!"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

//*更新文章
router.post('/update', checkToken, async (req, res, next) => {
    const { _id, title, content } = req.body

    try {
        await Posts.findByIdAndUpdate(_id, { title, content, update_date: new Date().getTime() })
    } catch (error) {
        res.status(500).json({
            message: error.error
        })
    }

    res.json({
        message: "更新成功！"
    })

})
module.exports = router