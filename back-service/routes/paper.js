const router = require('koa-router')()
const db = require('../common/db.js')
const fun = require('../common/fun.js')
const moment = require('moment')

// 数据库操作
const papers = require('../model/papers')
const Op = require('sequelize').Op

router.prefix('/paper')

router.get('/', async (ctx, next) => {
  ctx.body = 'this is a users response!'
})

// 创建试卷
router.post('/create', async (ctx, next) => {
  const params = ctx.request.body
  params.account = ctx.account

  // 如果试卷存在id，表示该试卷已经存在，则更新数据
  if (params.paperId) {
    const where = { paperId: params.paperId }
    // 试卷存在，找出相应试卷，更新数据
    const paper = await papers.findOne({ where })
    const res = await paper.update(params, { where })
    ctx.body = {
      code: res ? 200 : 104,
      message: res ? '保存成功' : '保存失败'
    }
  } else {
    // 创建id
    let flag = true
    while(flag) {
      params.paperId = 'p' + Date.now()
      flag = await papers.findOne({ where: { paperId: params.paperId } })
    }

    try {
      const paper = await papers.create(params)
      ctx.body = {
        code: paper ? 200 : 104,
        data: paper,
        message: paper ? '创建成功' : '创建失败'
      }
    } catch(err) {
      ctx.body = {
        code: 104,
        message: '出错了'
      }
    }
  }
})

// 查询试卷列表（包括考过的和创建的）
router.get('/getPapers', async (ctx, next) => {
  const params = ctx.query

  const where = { account: ctx.account }
  const { rows: data, count: total } = await papers.findAndCountAll({
    where,
    offset: (+params.page - 1) * +params.pageSize,
    limit: +params.pageSize,
    order: [
      ['createdAt', 'DESC']
    ]
  })
  const flag = !!data
  ctx.body = {
    code: flag ? 200 : 104,
    message: flag ? '查询成功' : '查询失败,请稍后重试',
    data,
    total
  }
})

// 删除试卷
router.post('/detelePaper', async (ctx, next) => {
  const params = ctx.request.body
  const where = { account: ctx.account, paperId: params.paperId }
  const res = await papers.destroy({ where })
  ctx.body = {
    code: res ? 200 : 103,
    message: res ? '删除成功' : '删除失败'
  }
})

// 根据试卷id获取试卷信息
router.get('/getPaperDetail', async (ctx, next) => {
  const params = ctx.query
  const where = { account: ctx.account, paperId: params.paperId }
  const data = await papers.findOne({ where })
  ctx.body = {
    code: data ? 200 : 103,
    data: { config: data },
    message: data ? '查询成功' : '试卷信息获取失败，请稍后重试'
  }
})


module.exports = router