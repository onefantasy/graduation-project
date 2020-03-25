const router = require('koa-router')()
// 数据库操作
const db = require('../common/db.js')

// 数据库操作
// 加载各种题型的模型实例
const questions = {
  single: require('../model/singles'),
  multiple: require('../model/multiples'),
  judge: require('../model/judges'),
  completion: require('../model/completions'),
  essay: require('../model/essays')
}
const Op = require('sequelize').Op

router.prefix('/question')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a question response!'
})

// 保存题目
router.post('/save', async (ctx, next) => {
  const params = ctx.request.body

  // 需要进行操作的表
  const table = params.type

  if (params.qid) {
    // 存在qid存在，说明需要更改试题信息
    const where = { qid: params.qid }
    const data = await questions[table].findOne({ where })
    console.log('要更改试题的数据：', data)
    const res = data.update(params.content, { where })
    ctx.body = {
      code: res ? 200 : 103,
      message: res ? '更改成功' : '更改失败'
    }
  } else {
    // 不存在qid，说明为创建试题
    let flag = true
    while(flag) {
      // 创建id
      params.content.qid = 'q' + Date.now()
      flag = await questions[table].findOne({ where: { qid: params.content.qid } })
    }

    // 插入数据库
    try {
      params.content.account = ctx.account
      const res = await questions[table].create(params.content)
      ctx.body = {
        code: res ? 200 : 103,
        data: res,
        message: res ? '创建成功' : '创建失败'
      }
    } catch(err) {
      ctx.body = {
        code: 104,
        message: '出错了'
      }
    }
  }
})

// 获取试题列表
router.get('/getQuestionList', async (ctx, next) => {
  
})

module.exports = router
