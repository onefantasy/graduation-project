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
  content: Sequelize.TEXT,
  score: Sequelize.INTEGER,
  A: Sequelize.TEXT,
  B: Sequelize.TEXT,
  C: Sequelize.TEXT,
  D: Sequelize.TEXT,
  rightKey: Sequelize.STRING
}, { freezeTableName: true })

module.exports = singles