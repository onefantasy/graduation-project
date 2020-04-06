const router = require('koa-router')()

// 数据库操作
const exam = require('../model/examRecords')
const papers = require('../model/papers')
const users = require('../model/users')
const answers = require('../model/answerRecords')
const Op = require('sequelize').Op

router.prefix('/exam')

// 开始考试接口，生成记录
router.post('/startExam',async (ctx, next) => {
  const params = ctx.request.body

  
  const paper = await papers.findOne({ where: { paperId: params.paperId } })
  if (!paper) {
    ctx.body = {
      code: 404,
      message: '不存在此试卷'
    }
    return false
  }
  let startTime = params.startExam.replace(new RegExp("-", "gm"), "/")
  startTime = (new Date(startTime)).getTime()
  // 检查是否已经可以开始考试 开始
  let pStartTime = paper.startTime.replace(new RegExp("-","gm"),"/")
  pStartTime = (new Date(pStartTime)).getTime()
  if (pStartTime > startTime) {
    ctx.body = {
      code: 103,
      message: '该试卷尚未开始考试！'
    }
  }
  // 检查是否已经可以开始考试 结束

  // 查看是否已经超过了截止考试的时间 开始
  let pEndTime = paper.endTime.replace(new RegExp("-","gm"),"/")
  pEndTime = (new Date(pEndTime)).getTime()
  if (startTime > pEndTime) {
    ctx.body = {
      code: 103,
      message: '已经超过了该试卷的截止考试时间，无法进行考试！'
    }
    return false
  }
  // 查看是否已经超过了截止考试的时间 结束

  const where = { paperId: params.paperId, account: ctx.account }

  // 查询该账号是否已经参加过该试卷的考试
  const res = await exam.findOne({ where })
  // 查看是否已经考过试
  if (res) { 
    ctx.body = { code: 104, message: '您已经参加过该试卷的考试了' } 
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

// 结束考试 完善记录
router.post('/endExam', async (ctx, next) => {
  const params = ctx.request.body
  if (!params.eid) {
    ctx.body = { code: 404, message: '尚未发现该记录' }
    return false
  }
  // 查询开始
  const where = { eid: params.eid }
  const data = await exam.findOne({ where })
  if (!data) {
    ctx.body = { code: 404, message: '尚未发现该记录' }
    return false
  }
  // 开始更新
  const res = await data.update(params)
  ctx.body = {
    code: res ? 200 : 103,
    message: res ? '交卷成功' : '交卷失败'
  }
})

// 根据用户id获取其的考试记录(用于展示在表格中)
router.get('/getExamedPaper', async (ctx, next) => {
  const params = ctx.query
  exam.belongsTo(papers, { foreignKey: 'paperId' })
  papers.belongsTo(users, { foreignKey: 'account' })
  const searchArr = ['paperId', 'paperTitle', 'subject']
  const where = { account: ctx.account }
  searchArr.map(item => {
    params[item] && (where[item] = { [Op.substring]: params[item] })
  })
  where.endExam = { [Op.not]: null }
  const { rows: data, count: total } = await exam.findAndCountAll({
    where,
    offset: (+params.page - 1) * +params.pageSize,
    limit: +params.pageSize,
    include: {
      model: papers,
      include: {
        model: users,
        attributes: ['name']
      }
    },
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

// 获取某个用户在某张试卷上的考试记录(有统计排名，所以不用eid)
router.post('/getExamRecordByAP', async (ctx, next) => {
  const params = ctx.request.body
  const where = { paperId: params.paperId }
  const { rows: data, count: total } = await exam.findAndCountAll({
    where,
    order: [
      ['scoreExam', 'DESC']
    ]
  })
  // 本张试卷记录条数
  const recordNumber = total
  // 排名
  let orderNumber = 0
  // 需要取出的数据
  let target = ''

  console.log('考试情况：', data)

  // 便利所有记录找出自己需要的记录
  for (let i = 0; i < recordNumber; i++) {
    console.log('data.eid: ', data[i].eid)
    console.log('params.eid: ', params.eid)
    console.log('i: ', i)
    if (data[i].eid === params.eid) {
      target = data[i]
      orderNumber = i + 1
      break
    }
  }

  ctx.body = {
    code: orderNumber ? 200 : 103,
    message: orderNumber ? '查询成功' : '查询失败',
    data: {
      target,
      orderNumber,
      recordNumber
    }
  }
})

// 根据paperId获取某张试卷的考试整体情况（教师专用接口，用于统计考试情况）
router.get('/getExamOverallByPid', async (ctx, next) => {
  const params = ctx.query

  let where = { paperId: params.paperId, account: ctx.account }

  const res = await papers.findOne({ where })

  if (!res) {
    ctx.body = {
      code: 404,
      message: '不存在此试卷！'
    }
    return false
  }

  // exam.belongsTo(papers, { foreignKey: 'paperId' })
  exam.belongsTo(users, { foreignKey: 'account' })
  exam.hasMany(answers, { foreignKey: 'eid' })
  where = { paperId: params.paperId }
  const { rows: data, count: total } = await exam.findAndCountAll({ 
    where,
    order: [
      ['scoreExam', 'DESC']
    ],
    include: [
      // {
      //   model: papers
      // },
      {
        model: users,
        attributes: { exclude: ['password'] }
      },
      {
        model: answers,
        raw: true
      }
    ]
  })

  ctx.body = {
    code: data ? 200 : 103,
    message: data ? '查询成功' : '查询失败',
    data,
    total
  }
})

// 批卷，更改分数
router.post('/changeScore', async (ctx, next) => {
  const params = ctx.request.body
  console.log('接收到的参数：', params)
  // 找出该考试记录
  const data = await exam.findOne({ where: { eid: params.eid } })
  if (!data) {
    ctx.body = {
      code: 404,
      message: '不存在此考试记录！'
    }
    return false
  }
  // 更新考试记录的总分数
  const typeName = params.type + 'Exam'
  const res = await data.update({ scoreExam: params.totalScore, [typeName]: +data[typeName] + +params.gap })
  if (!res) {
    ctx.body = {
      code: 103,
      message: '试卷分数更新失败！'
    }
    return false
  }
  // 更新某道试题的得分情况
  const res_1 = await answers.update({ score: params.newScore, isTrue: +params.newScore !== 0 }, { where: { eid: params.eid, qid: params.qid } })
  ctx.body = {
    code: res_1 ? 200 : 103,
    message: res_1 ? '更新试题分数成功' : '更新试题分数失败'
  }
})

module.exports = router