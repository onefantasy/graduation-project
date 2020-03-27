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
  singles: Sequelize.INTEGER,
  singlesScore: Sequelize.INTEGER,
  multiples: Sequelize.INTEGER,
  multiplesScore: Sequelize.INTEGER,
  judges: Sequelize.INTEGER,
  judgesScore: Sequelize.INTEGER,
  completions: Sequelize.INTEGER,
  completionsScore: Sequelize.INTEGER,
  essays: Sequelize.INTEGER,
  essaysScore: Sequelize.INTEGER,
  text: Sequelize.TEXT,
  publish: {
    // 发布状态
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, { freezeTableName: true })

module.exports = papers