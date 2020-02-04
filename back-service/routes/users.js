const router = require('koa-router')()
// 数据库操作
const db = require('../common/db.js')
// token 
const token = require ('../common/jwt.js')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 用户注册
router.post('/register',async (ctx, next) => {
  const params = ctx.request.body
  const flag = await db.isExist(params, 'user', 'account')

  if(!flag) ctx.body = {
    code: 10001,
    message: '用户已存在'
  } 
  else {
    db.insert(params, 'user')
    ctx.body = {
      code: 20000,
      message: '注册成功'
    }
  }
})

// 登录验证
router.post('/login', async (ctx, next) => {
  const params = ctx.request.body
  const result = await db.query(`select password,role from user where account="${params.account}"`)
  if(result.length === 0){
  	ctx.body = {
  		code: 40004,
  		message: '账号不存在'
  	}
  }else if(result[0].password !== params.password){
  	ctx.body = {
  		code: 50002,
  		message: '密码错误'
  	}
  }else{
  	const tag = token.create({account: params.account})

  	ctx.body = {
  		code: 20000,
  		message: '登陆成功',
  		data: {token:tag}
  	}
  }
})

// 获取用户信息
router.get('/info', async (ctx, next) => {
  const result = await db.query(`select * from user where account="${ctx.account}"`)
  if (result.length === 0) {
    ctx.body = {
      code: 40004,
      message: '不存在此账号'
    }
  } else {
    ctx.body = {
      code: 20000,
      message: '获取用户信息成功',
      data: result[0]
    }
  }
})

// 设置用户信息
router.post('/setInfo', async (ctx, next) => {
  const params = ctx.request.body
  const flag = await db.isExist(ctx, 'user', 'account')

  if(!!flag) ctx.body = {
    code: 10001,
    message: '用户不存在'
  } 
  else {
    // 生成更新数据
    const sqlStr = ['name','role','school','major','class','number','age','sex'].map(item => {
      return !!params[item] ? `${item}="${params[item]}"` : `${item}=null`
    }).join(',')
    // 执行数据库插入
    await db.query(`update user set ${sqlStr} where account="${ctx.account}"`)
    ctx.body = {
      code: 20000,
      message: '数据更新成功'
    }
  }
})

// 退出登陆
router.post('/logout', async (ctx,next) => {
  ctx.body = {
  	code: 20000,
  	message: '成功退出'
  }
})

module.exports = router
