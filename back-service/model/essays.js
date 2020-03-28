// 问答题表
const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const essays = sequelize.define('essays', {
  qid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  account: {
    type: Sequelize.STRING,
    allowNull: false
  },
  paperId: Sequelize.STRING,
  state: Sequelize.STRING,
  content: Sequelize.TEXT('long'),
  score: Sequelize.INTEGER,
  rightKey: Sequelize.TEXT('long'),
  // 试题在试卷中的序号
  orderNumber: Sequelize.INTEGER
}, { freezeTableName: true })

module.exports = essays