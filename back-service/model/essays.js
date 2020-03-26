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
  content: Sequelize.TEXT,
  score: Sequelize.INTEGER,
  rightKey: Sequelize.TEXT,
  // 试题在试卷中的序号
  orderNumber: Sequelize.INTEGER
}, { freezeTableName: true })

module.exports = essays