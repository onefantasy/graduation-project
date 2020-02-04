import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './base_modules/app'
import settings from './base_modules/settings'
import user from './base_modules/user'

// 自己定义的模块
import paper from './modules/paper'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    paper
  },
  getters
})

export default store
