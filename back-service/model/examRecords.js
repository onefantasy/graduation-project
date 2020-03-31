// 考试记录表
const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const examRecords = sequelize.define('examRecords', {
  // 考试记录的id
  eid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  // 考试者
  account: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // 考试的试卷
  paperId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // 试卷标题
  paperTitle: Sequelize.STRING,
  // 科目
  subject: Sequelize.STRING,
  // 开始考试时间
  startExam: Sequelize.STRING,
  // 结束考试时间
  endExam: Sequelize.STRING,
  // 考试用时
  timeExam: Sequelize.STRING,
  // 总得分
  scoreExam: Sequelize.INTEGER,
  // 单选题得分
  singlesExam: Sequelize.INTEGER,
  // 多选题得分
  multiplesExam: Sequelize.INTEGER,
  // 判断题得分
  judgesExam: Sequelize.INTEGER,
  // 填空题得分
  completionsExam: Sequelize.INTEGER,
  // 问答题得分
  essaysExam: Sequelize.INTEGER
}, { freezeTableName: true })

module.exports = examRecords