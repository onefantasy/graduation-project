const router = require('koa-router')()
// token 
const token = require ('../common/jwt.js')
//引入bcryptjs 对密码进行加密解密
const bcrypt = require('bcryptjs');

// 数据库操作
const users = require('../model/users')
const Op = require('sequelize').Op

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 用户注册
router.post('/register',async (ctx, next) => {
  const params = ctx.request.body
  // 加密用的盐
  const slat = bcrypt.genSaltSync(10)
  // 插入数据库时，对密码进行加密
  params.password = bcrypt.hashSync(params.password, slat)
  try {
    const user = await users.create(params)
    ctx.body = {
      code: user ? 200 : 104,
      data: user,
      message: user ? '创建成功' : '创建失败'
    }
  } catch(err) {
    if (err.errors && err.errors[0].type === 'unique violation') {
      ctx.body = {
        code: 103,
        message: '该账号已经存在'
      }
      return false
    }
    ctx.body = {
      code: 104,
      message: '出错了'
    }
  }
})

// 登录验证
router.post('/login', async (ctx, next) => {
  const params = ctx.request.body
  const data = await users.findOne({
    where: {
      account: {
        [Op.eq]: `${params.account}`
      }
    }
  })
  if (!data) {
    ctx.body = {
      code: 404,
      message: '账号不存在'
    }
  } else if (!bcrypt.compareSync(params.password, data.password)) {
    // 对密码进行校验，如果不对，则返回下面语句
    ctx.body = {
      code: 103,
      message: '密码错误'
    }
  } else {
    // 对密码进行校验，如果密码正确，则返回下面语句
    const tag = token.create({account: params.account})
    ctx.body = {
      code: 200,
      message: '登录成功',
      data: { token: tag }
    }
  }
})

// 获取用户信息
router.get('/info', async (ctx, next) => {
  const params = ctx.account
  // 查询要设置信息的账户是否存在
  const user = await users.findOne({
    where: {
      account: {
        [Op.eq]: `${params}`
      }
    },
    attributes: { exclude: ['password'] }
  })
  ctx.body = {
    code: user ? 200 : 404,
    message: user ? '查询成功' : '不存在该用户',
    data: user
  }
})

// 设置用户信息
router.post('/setInfo', async (ctx, next) => {
  const params = ctx.request.body
  // 查询要设置信息的账户是否存在
  const user = await users.findOne({
    where: {
      account: {
        [Op.eq]: `${ctx.account}`
      }
    }
  })
  // 如果不存在此账户，则说明不存在
  if (!user) {
    ctx.body = {
      code: 404,
      message: '不存在该用户'
    }
    return false
  }
  // 更新数据
  const res = await users.update(params, {
    where: {
      account: ctx.account
    }
  })

  ctx.body = {
    code: res ? 200 : 500,
    message: res ? '更新成功' : '更新失败'
  }
})

// 退出登陆
router.post('/logout', async (ctx, next) => {
  ctx.body = {
  	code: 200,
  	message: '成功退出'
  }
})

// 更改密码
router.post('/changePassword', async (ctx, next) => {
  const params = ctx.request.body
  const user = await users.findOne({ where: { account: ctx.account } })
  if (!user) {
    ctx.body = {
      code: 404,
      message: '不存在此账号'
    }
    return false
  }
  if (!bcrypt.compareSync(params.old, user.password)) {
    ctx.body = {
      code: 103,
      message: '旧密码不正确！'
    }
    return false
  } else {
    // 加密用的盐
    const slat = bcrypt.genSaltSync(10)
    // 插入数据库时，对密码进行加密
    params.newOne = bcrypt.hashSync(params.newOne, slat)
    const res = await user.update({ password: params.newOne })
    ctx.body = {
      code: res ? 200 : 103,
      message: res ? '更新成功' : '更新失败'
    }
  }
})

module.exports = router
