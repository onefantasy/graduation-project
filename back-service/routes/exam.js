const router = require('koa-router')()

// 数据库操作
const exam = require('../model/examRecords')
const Op = require('sequelize').Op

router.prefix('/exam')

// 开始考试接口，生成记录
router.post('/startExam',async (ctx, next) => {
  const params = ctx.request.body
  console.log('参数：', params)

  const where = { paperId: params.paperId, account: ctx.account }

  // 查询该账号是否已经参加过该试卷的考试
  const res = await exam.findOne({ where })
  // 查看是否已经考过试
  if (res) { 
    ctx.body = { code: 104, message: '您已经参加过该试的考试了' } 
    return false 
  }
  // 创建id
  let flag = true
  while(flag) {
    params.eid = 'e' + Date.now()
    flag = await exam.findOne({ where: { eid: params.eid } })
  }
  try {
    const data = await exam.create(params)
    ctx.body = {
      code: data ? 200 : 104,
      data,
      message: data ? '开始考试' : '开始考试是失败'
    }
  } catch(err) {
    ctx.body = {
      code: 500,
      message: '出错了'
    }
  }
})

module.exports = router