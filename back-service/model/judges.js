const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const judges = sequelize.define('judges', {
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
  rightKey: Sequelize.STRING
}, { freezeTableName: true })

module.exports = judges