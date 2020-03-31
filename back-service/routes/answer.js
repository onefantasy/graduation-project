const router = require('koa-router')()

// 数据库操作
const answers = require('../model/answerRecords')
const Op = require('sequelize').Op

router.prefix('/answer')

// 保存答题记录
router.post('/saveAnswerRecords', async (ctx, next) => {
  const params = ctx.request.body.records

  // 创建id
  let flag = true
  let id = ''
  while(flag) {
    id = Date.now()
    flag = await answers.findOne({ where: { eid: 'a' + id } })
  }
  // 为每条记录赋予id
  for (let i = 0, l = params.length; i < l; i++) {
    params[i].aid = 'a' + (id + i)
  }
  // 批量插入
  const res = await answers.bulkCreate(params)
  ctx.body = {
    code: res[0] ? 200 : 103,
    message: res[0] ? '记录成功' : '记录失败'
  }
})

module.exports = router
