const router = require('koa-router')()

// 数据库操作
const answer = require('../model/answerRecords')
const Op = require('sequelize').Op

router.prefix('/answer')

// 生成

module.exports = router
