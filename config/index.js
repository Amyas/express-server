module.exports = {
    port: 3000,//项目端口
    mongodbURL: 'mongodb://localhost:27017/blog',//mongodb地址
    tokenSecret: 'amyas',//token密匙
    tokenExpires: '86400s'//token过期时间（86400=12小时）
}