// 考试答题记录表
const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const answerRecords = sequelize.define('answerRecords', {
  // 答题记录id
  aid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  // 考试记录id
  eid: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // 试卷id
  paperId: Sequelize.STRING,
  // 题型
  questionType: Sequelize.STRING
}, { freezeTableName: true })

module.exports = answerRecords