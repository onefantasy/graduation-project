// 单选题表
const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const singles = sequelize.define('singles', {
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
  A: Sequelize.TEXT('long'),
  B: Sequelize.TEXT('long'),
  C: Sequelize.TEXT('long'),
  D: Sequelize.TEXT('long'),
  rightKey: Sequelize.STRING,
  // 试题在试卷中的序号
  orderNumber: Sequelize.INTEGER
}, { freezeTableName: true })

module.exports = singles