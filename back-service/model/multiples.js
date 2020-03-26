const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const multiples = sequelize.define('multiples', {
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
  content: Sequelize.TEXT,
  score: Sequelize.INTEGER,
  A: Sequelize.TEXT,
  B: Sequelize.TEXT,
  C: Sequelize.TEXT,
  D: Sequelize.TEXT,
  E: Sequelize.TEXT,
  F: Sequelize.TEXT,
  rightKey: Sequelize.STRING,
  // 试题在试卷中的序号
  orderNumber: Sequelize.INTEGER
}, { freezeTableName: true })

module.exports = multiples