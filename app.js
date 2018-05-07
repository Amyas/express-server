const express = require('express')
const app = express()
const config = require('./config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routers = require('./routers')

//解析json
app.use(bodyParser.json())
//返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({ extended: true }))

//路由
routers(app)

mongoose.connect(config.mongodbURL, (err) => {
    if (err) {
        console.log('数据库连接失败！')
        return
    }
    app.listen(config.port, () => {
        console.log(`项目启动成功,启动端口:${config.port}`)
    })
})

