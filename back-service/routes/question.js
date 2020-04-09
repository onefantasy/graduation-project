const router = require('koa-router')()

// 数据库操作
// 加载各种题型的模型实例
const questions = {
  singles: require('../model/singles'),
  multiples: require('../model/multiples'),
  judges: require('../model/judges'),
  completions: require('../model/completions'),
  essays: require('../model/essays')
}
// const Op = require('sequelize').Op

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

// 根据试卷id查询该试卷已经存储到所有题目
router.get('/getPaperQuestions', async (ctx, next) => {
  // 所有试题类型的表格
  const tables = Object.keys(questions)
  const where = { paperId: ctx.query.paperId }
  const params = { where }
  ctx.query.type === 'exam' && ( params.attributes = { exclude: ['rightKey'] } )
  const data = {}
  for (let item of tables) {
    const res = await questions[item].findAll(params)
    res.length && (data[item] = res)
  }
  ctx.body = {
    code: 200,
    data,
    message: '查询成功'
  }
})

// 根据账号获取去收藏的题目
router.get('/getCollecQuestions', async (ctx, next) => {
  const params = ctx.query
  const account = ctx.account
  const where = { account, state: params.state }
  const { rows: data, count: total } = await questions[params.type].findAndCountAll({
    where,
    order: [
      ['createdAt', 'DESC']
    ]
  })
  ctx.body = {
    code: data ? 200 : 103,
    message: data ? '查询成功' : '查询失败',
    data,
    total
  }
})

module.exports = router
