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
  questionType: Sequelize.STRING,
  // 试题id
  qid: Sequelize.STRING,
  // 考试者的答案
  mineAnswer: Sequelize.STRING,
  // 回答是否正确
  isTrue: Sequelize.BOOLEAN,
  // 得分
  score: Sequelize.INTEGER
}, { freezeTableName: true })

module.exports = answerRecords