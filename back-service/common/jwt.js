// 本文件用于进行token的生成、解析、刷新
const jwt = require('jsonwebtoken')

// 导入user模块进行ip验证
const users = require('../model/users')

// token 密钥
const secret = 'Examination-Online'

// token 存在时间 单位秒
const expiresIn = 4 * 60 * 60

// 生成token 
const create = (data) => {
  const token = jwt.sign(data,secret,{expiresIn})
  return token
}


// 验证token 
const analyse = async (token,ctx) => {
  let flag = false
  jwt.verify(token, secret, {ignoreExpiration:false}, function(err, decoded) {
    if(err) {
      flag = 1
    }
  });
  const user = await users.findOne({ where: { account: ctx.account } })
  // if (user.origin !== (ctx.header.origin || ctx.header.Host)) {
  //   flag = 2
  // }
  ctx.admin = user.role === 'admin'
  return flag
}

// 解析token 
const decoded = (token,ctx) => {
	const result = jwt.decode(token)
	ctx.account = result.account
}

// 刷新token 
const refresh = () => {

}

module.exports = {
	create,
	analyse,
	refresh,
	decoded
}