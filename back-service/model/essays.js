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
  rightKey: Sequelize.TEXT
}, { freezeTableName: true })

module.exports = essays