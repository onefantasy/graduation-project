const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const papers = sequelize.define('papers', {
  paperId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  account: {
    type: Sequelize.STRING,
    allowNull: false
  },
  paperTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  subject: {
    type: Sequelize.STRING,
    allowNull: false
  },
  time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  startTime: {
    type: Sequelize.STRING,
    allowNull: false
  },
  endTime: {
    type: Sequelize.STRING,
    allowNull: false
  },
  totalScore: Sequelize.INTEGER,
  single: Sequelize.INTEGER,
  singleScore: Sequelize.INTEGER,
  multiple: Sequelize.INTEGER,
  multipleScore: Sequelize.INTEGER,
  judge: Sequelize.INTEGER,
  judgeScore: Sequelize.INTEGER,
  completion: Sequelize.INTEGER,
  completionScore: Sequelize.INTEGER,
  essay: Sequelize.INTEGER,
  essayScore: Sequelize.INTEGER,
  text: Sequelize.TEXT,
  publish: {
    // 发布状态
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, { freezeTableName: true })

module.exports = papers