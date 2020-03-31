const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
// 用户接收上传的图片和文件
const koaBody = require('koa-body')
const logger = require('koa-logger')
const path = require('path')

// 跨域
const cors = require('koa2-cors')

// token 
const token = require('./common/jwt.js')

// 导入路由
const index = require('./routes/index')
const users = require('./routes/users')
const image = require('./routes/image')
const paper = require('./routes/paper')
const question = require('./routes/question')
const exam = require('./routes/exam')
const answer = require('./routes/answer')

// 决解跨域以及options请求
app.use(
  cors({
    origin: function(ctx) { //设置允许来自指定域名请求
      if (ctx.url === '/test') {
        return '*'; // 允许来自所有域名请求
      }
      return 'http://localhost:9528'; //只允许http://localhost:8081这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','x-token'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','token'] //设置获取其他自定义字段
  })
);

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// koa-body 配置
app.use(koaBody({
  multipart: true,
  formidable: {
    // 设置上传的文件的大小限制
    maxFileSize: 1024 * 1024 * 5,    
    // 设置文件的默认保存目录，不设置则保存在系统的临时目录下
    uploadDir: path.resolve(__dirname,'./public/images/headIcon')
  }
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 对请求进行token验证
const notAnalyse = ['/users/login','/users/logout','/users/register']	// 不用进行token验证的请求
app.use(async (ctx,next) => {  
  if(!!ctx.header['x-token']) token.decoded(ctx.header['x-token'], ctx)
  if(notAnalyse.indexOf(ctx.url) === -1 && !token.analyse(ctx.header['x-token'],ctx)){
    ctx.body = {
      code: 508,
      message: '登陆超时，请重新登陆！'
    }
  } else {
    await next()
  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(image.routes(), image.allowedMethods())
app.use(paper.routes(), paper.allowedMethods())
app.use(question.routes(), question.allowedMethods())
app.use(exam.routes(), exam.allowedMethods())
app.use(answer.routes(), answer.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
