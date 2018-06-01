const express = require('express')
const router = express.Router()
const Posts = require('../../models/Posts')

router.get('/detail', async (req, res, next) => {
  let detail;
  try {
    detail = await Posts.findById(req.query.id)
    if (!detail) {
      throw new Error('没有找到该文章！')
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }

  res.json({
    data: {
      detail
    }
  })

})

module.exports = router