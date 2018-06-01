const express = require('express')
const router = express.Router()
const Posts = require('../../models/Posts')

//获取首页列表
router.get('/list', async (req, res, next) => {

  let posts;
  try {
    posts = await Posts.find({}, { content: 0 })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }

  res.json({
    data: {
      list: posts
    }
  })

})

module.exports = router