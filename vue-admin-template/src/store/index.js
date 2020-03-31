import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './base_modules/app'
import settings from './base_modules/settings'
import user from './base_modules/user'
import tagsView from './base_modules/tagsView'
import permission from './base_modules/permission'

// 自己定义的模块
import paper from './modules/paper'
import constant from './modules/constant'
import question from './modules/question'
import exam from './modules/exam'
import answer from './modules/answer'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tagsView,
    permission,
    paper,
    constant,
    question,
    exam,
    answer
  },
  getters
})

export default store
