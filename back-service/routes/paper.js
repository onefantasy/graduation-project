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

  // if (params.paperId) {
  //   // 如果已经存在此试卷，则更改试卷信息
  //   const paramsArr = [
  //     'paperTitle',
  //     'subject',
  //     'time',
  //     'startTime',
  //     'endTime',
  //     'totalScore',
  //     'single',
  //     'singleScore',
  //     'multiple',
  //     'multipleScore',
  //     'judge',
  //     'judgeScore',
  //     'completion',
  //     "completionScore",
  //     'essay',
  //     'essayScore',
  //     'text'
  //   ]
  //   const sqlStr = paramsArr.map(item => {
  //     return !!params[item] || params[item] === 0 ? `${item}="${params[item]}"` : `${item}=null`
  //   }).join(',')
  //   // 执行数据库插入
  //   await db.query(`update paper set ${sqlStr} where paperId="${params.paperId}"`)
  //   ctx.body = {
  //     code: 20000,
  //     message: '数据更新成功'
  //   }
  // } else {
  //   // 如果不存在此试卷，则进行创建
  //   let flag = false
  //   while(!flag) {
  //     // 创建id
  //     params.paperId = Date.now()
  //     flag = await db.isExist(params, 'paper', 'paperId')
  //   }
  
  //   params.createdDate = moment().format('YYYY-MM-DD HH:mm:ss')
  //   console.log('插入的数据：', params)
  
  //   // 插入数据库
  //   if(await db.insert(params, 'paper')) {
  //     ctx.body = {
  //       code: 20000,
  //       message: '保存试卷成功',
  //       paperId: params.paperId
  //     } 
  //   } else {
  //     ctx.body = {
  //       code: 10001,
  //       message: '保存试卷失败'
  //     }
  //   }
  // }

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
  // const res = await db.getPageDate(ctx, 'paper', 'account', 'paperId', params.page, params.pageSize)
  // if ((res.total || res.total === 0) && res.data) {
  //   ctx.body = {
  //     code: 20000,
  //     message: '查询成功',
  //     ...res
  //   }
  // } else {
  //   ctx.body = {
  //     code: 10001,
  //     message: '查询失败'
  //   }
  // }
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
  await db.query(`delete from paper where account="${ctx.account}" and paperId="${params.paperId}"`).then(res => {
    if(res.affectedRows === 0) {
      ctx.body = {
        code: 10001,
        message: '不存在要删除的试卷'
      }
    } else {
      ctx.body = {
        code: 20000,
        message: '删除成功',
        // 删除的数据条数
        affectedRows: res.affectedRows
      }
    }
  }).catch(err => {
    ctx.body = {
      code: 10002,
      message: '删除失败，请稍后重试'
    }
  })
})

// 根据试卷id获取试卷信息
router.get('/getPaperDetail', async (ctx, next) => {
  const params = ctx.query
  await db.query(`select * from paper where paperId="${params.paperId}"`).then(res => {
    ctx.body = {
      code: 20000,
      message: '查询成功',
      data: { config: res[0] }
    }
  }).catch(err => {
    ctx.body = {
      code: 10002,
      message: '查询试卷信息失败'
    }
  })
})


module.exports = router