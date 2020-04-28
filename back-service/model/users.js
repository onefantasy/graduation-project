// 用户信息记录表
const sequelize = require('../sequelize')
const Sequelize = require('sequelize')
// 引入bcryptjs 对密码进行加密解密
const bcrypt = require('bcryptjs');

const users = sequelize.define('users', {
  account: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
  },
  school: {
    type: Sequelize.STRING
  },
  class: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  number: {
    type: Sequelize.STRING
  },
  sex: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  },
  headIcon: {
    type: Sequelize.STRING
  },
  major: {
    type: Sequelize.STRING
  },
  // 最近登陆时间
  latestTime: Sequelize.DATE,
  // 上次登陆客户端的地址
  origin: Sequelize.STRING
}, {freezeTableName: true})

// 创建管理员账号 开始
const res = users.findOne({ where: { role: 'admin' } }).then(res => {
  if (!res) {
    // 如果不存在管理员账号，则创建
    // 加密用的盐
    const slat = bcrypt.genSaltSync(10)
    // 插入数据库时，对密码进行加密
    const password = bcrypt.hashSync('admin123', slat)
    const user = users.create({
      account: 'admin',
      password,
      role: 'admin',
      name: '管理员',
      sex: 1
    })
  }
})
// 创建管理员账号 结束

module.exports = users