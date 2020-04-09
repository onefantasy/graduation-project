const router = require('koa-router')()
const fs = require('fs')

const files = require('../common/files.js')
const config = require('../config.js')

// 数据库操作
const users = require('../model/users')

router.prefix('/image')

// 保存头像
router.post('/saveHeadIcon', async (ctx,next) => {
  const params = ctx.request
  const {path, ext, file} = files.fileInfo(params)
  // 更改文件的保存路径和名字
  const newPath = files.changePath(path, params, ext, ctx)
  if( file.size > 0 && newPath ){
    // 判断需要生成的路径是否存在，若不存在，则进行生成
    files.pathExist(newPath)
    // 重新命名图片 或者 更改文件保存路径(此处保存和更改路径操作)
    fs.renameSync(path, newPath)
    // 网络请求该图片的路径
    const imgUrl = `http://${config.server_baseUrl}:${config.server_port}/images${newPath.split('images')[1].replace(/\\/g,'/')}`
    const res = await users.update({
      headIcon: imgUrl
    },{
      where: { account: ctx.account }
    })

    if (res) {
      ctx.body = {
        code: 200,
        message: '更换头像成功',
        imgUrl
      }
    } else {
      ctx.body = {
        code: 104,
        message: '更换头像失败，请稍后重试'
      }
    }
  } else {
    ctx.body = {
      code: 10001,
      message: '图片保存失败'
    }
  }
})

module.exports = router