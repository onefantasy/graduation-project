// 本文件用于进行token的生成、解析、刷新
const jwt = require('jsonwebtoken')

// token 密钥
const secret = 'Examination-Online'

// token 存在时间 单位秒
const expiresIn = 7200


// 生成token 
const create = (data) => {
  const token = jwt.sign(data,secret,{expiresIn})
  return token
}


// 验证token 
const analyse = (token,ctx) => {
  let flag = false
  jwt.verify(token, secret, {ignoreExpiration:false}, function(err, decoded) {
    if(!err) {
      flag = true
    }
  });
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