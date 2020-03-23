const router = require('koa-router')()
// 数据库操作
const db = require('../common/db.js')
// token 
const token = require ('../common/jwt.js')

router.prefix('/question')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a question response!'
})

// 保存题目
router.post('/save', async (ctx, next) => {
  const params = ctx.request.body
  console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++')
  console.log('保存题目参数：', params)
  console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++')
  
  // 需要进行操作的表
  const table = params.type

  if (params.qid) {
    // 如果已经存在此试卷，则更改试卷信息
    const paramsArr = Object.keys(params.content)
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++')
  	console.log('需要进行操作的键', paramsArr)
  	console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++')
    // const sqlStr = paramsArr.map(item => {
    //   return !!params[item] || params[item] === 0 ? `${item}="${params[item]}"` : `${item}=null`
    // }).join(',')
    // // 执行数据库插入
    // await db.query(`update paper set ${sqlStr} where paperId="${params.paperId}"`)
    ctx.body = {
      code: 20000,
      message: '数据更新成功'
    }
  } else {
    // 如果不存在此试卷，则进行创建
    let flag = false
    while(!flag) {
      // 创建id
      params.content.qid = 'q' + Date.now()
      flag = await db.isExist(params, table, 'qid')
    }

    params.content.account = ctx.account
  
    // 插入数据库
    if(await db.insert(params.content, table)) {
      ctx.body = {
        code: 20000,
        message: '试题保存成功',
        qid: params.qid
      } 
    } else {
      ctx.body = {
        code: 10001,
        message: '试题保存失败'
      }
    }
  }
})

module.exports = router
