const router = require('koa-router')()
const db = require('../common/db.js')
const fun = require('../common/fun.js')
const moment = require('moment')

// 数据库操作
const papers = require('../model/papers')
const users = require('../model/users')
const exams = require('../model/examRecords')
const Op = require('sequelize').Op

// 试题
// 加载各种题型的模型实例
const questions = {
  singles: require('../model/singles'),
  multiples: require('../model/multiples'),
  judges: require('../model/judges'),
  completions: require('../model/completions'),
  essays: require('../model/essays')
}

router.prefix('/paper')

router.get('/', async (ctx, next) => {
  ctx.body = 'this is a paper response!'
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

// 查询试卷列表（创建的）
router.get('/getPapers', async (ctx, next) => {
  const params = ctx.query
  const searchArr = ['paperId', 'paperTitle', 'subject']
  const where = { account: ctx.account }
  searchArr.map(item => {
    params[item] && (where[item] = { [Op.substring]: params[item] })
  })
  params.publish && ( where.publish = params.publish === 'true' )
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
  // 级联删除试卷试题
  for (const key in questions) {
    await questions[key].destroy({ where })
  }
  const res = await papers.destroy({ where })
  ctx.body = {
    code: res ? 200 : 103,
    message: res ? '删除成功' : '删除失败'
  }
})

// 根据试卷id获取试卷信息
router.get('/getPaperDetail', async (ctx, next) => {
  const params = ctx.query
  papers.belongsTo(users, { foreignKey: 'account' })
  params.publish && (params.publish = params.publish.trim() === 'true')
  const where = params
  const data = await papers.findOne({ 
    where,
    include: {
      model: users,
      attributes: ['name', 'school', 'major', 'class', 'headIcon']
    }
  })
  ctx.body = {
    code: data ? 200 : 103,
    data: { config: data },
    message: data ? '查询成功' : '查询失败'
  }
})

// 改变试卷的发布状态
router.post('/changePublish', async (ctx, next) => {
  const params = ctx.request.body
  const where = { paperId: params.paperId }
  if (!ctx.admin) {
    where.account = ctx.account
  }
  const res = await papers.update({ publish: !params.publish }, { where })
  ctx.body = {
    code: res ? 200 : 103,
    message: res ? '更改成功' : '更改失败'
  }
})

// 教师专用接口（首页，根据账号，用于统计每张试卷的考试人数）
router.get('/getPapersAllCount', async (ctx, next) => {
  const account = ctx.account
  papers.hasMany(exams, { foreignKey: 'paperId' })
  const where = { account }
  const { rows: data, count: total } = await papers.findAndCountAll({
    where,
    attributes: ['paperTitle', 'publish'],
    offset: 0,
    limit: 10,
    include: {
      model: exams,
      attributes: ['eid']
    }
  })
  ctx.body = {
    code: data ? 200 : 103,
    message: data ? '查询成功' : '查询失败',
    data
  }
})

// 管理员：获取试卷列表信息
router.post('/adminPapers', async (ctx, next) => {
  if (!ctx.admin) {
    ctx.body = {
      code: 500,
      message: '无此权限！'
    }
    return false
  }
  const params = ctx.request.body
  let where = {}
  if (params.name) {
    where.name = { [Op.substring]: params.name }
    const data = await users.findAll({ where })
    where = {}
    data && (where.account = { [Op.or]: data.map(item => item.account) })
  }
  typeof params.publish === 'boolean' && (where.publish = params.publish)
  params.paperId && (where.paperId = { [Op.substring]: params.paperId })
  params.paperTitle && (where.paperTitle = { [Op.substring]: params.paperTitle })
  papers.belongsTo(users, { foreignKey: 'account' })
  const { rows: data, count: total } = await papers.findAndCountAll({
    where,
    offset: (+params.page - 1) * +params.pageSize,
    limit: +params.pageSize,
    include: {
      model: users,
      attributes: ['name', 'school', 'number']
    },
    order: [
      ['createdAt', 'DESC']
    ]
  })
  ctx.body = {
    code: data ? 200 : 103,
    message: data ? '查询成功！' : '查询失败！',
    data,
    total
  }
})

module.exports = router