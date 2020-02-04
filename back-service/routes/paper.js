const router = require('koa-router')()
const db = require('../common/db.js')
const fun = require('../common/fun.js')
const moment = require('moment')

router.prefix('/paper')

router.get('/', async (ctx, next) => {
  ctx.body = 'this is a users response!'
})

// 创建试卷
router.post('/create', async (ctx, next) => {
  const params = ctx.request.body
  params.account = ctx.account
  let flag = false 
  while(!flag) {
  	// 创建id
  	params.paperId = Date.now()
  	flag = await db.isExist(params, 'paper', 'paperId')
  }

  params.createdDate = moment().format('YYYY-MM-DD HH:mm:ss')
  console.log('插入的数据：', params)

  // 插入数据库
  if(db.insert(params, 'paper')) {
  	ctx.body = {
  	  code: 20000,
  	  message: '创建试卷成功',
  	  paperId: params.paperId
  	}	
  } else {
  	ctx.body = {
  	  code: 10001,
  	  message: '创建试卷失败'
  	}
  }
})

// 查询试卷列表（包括考过的和创建的）
router.get('/getPapers', async (ctx, next) => {
  const params = ctx.query
  const res = await db.getPageDate(ctx, 'paper', 'account', 'paperId', params.page, params.pageSize)
  if ((res.total || res.total === 0) && res.data) {
    ctx.body = {
      code: 20000,
      message: '查询成功',
      ...res
    }
  } else {
    ctx.body = {
      code: 10001,
      message: '查询失败'
    }
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