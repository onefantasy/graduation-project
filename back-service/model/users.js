// 用户信息记录表
const sequelize = require('../sequelize')
const Sequelize = require('sequelize')

const users = sequelize.define('users', {
  account: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
  },
  school: {
    type: Sequelize.STRING
  },
  class: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  number: {
    type: Sequelize.STRING
  },
  sex: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  },
  headIcon: {
    type: Sequelize.STRING
  },
  major: {
    type: Sequelize.STRING
  }
}, {freezeTableName: true})

module.exports = users