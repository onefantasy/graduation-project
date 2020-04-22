import {
  login,
  logout,
  getInfo,
  register,
  setInfo,
  changePassword,
  getUserList,
  adminChangePassword,
  adminChangeRole,
  adminDeleteAccount
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    info: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    setToken(token)
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        // setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        data.headIcon = data.headIcon ? data.headIcon : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        data.headIcon += '?time=' + Date.now()

        commit('SET_INFO', data)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 注册账号
  register({ commit }, data) {
    return new Promise((resolve, reject) => {
      register(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 设置用户信息
  setInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      setInfo(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 更新密码
  async changePassword({ commit }, data) {
    const res = await changePassword(data)
    return res
  },

  // 获取用户列表
  async getUserList({ commit }, params) {
    const res = await getUserList(params)
    return res
  },

  // 管理员：更改用户密码
  async adminChangePassword(ctx, data) {
    const res = await adminChangePassword(data)
    return res
  },

  // 管理员：更改用户身份
  async adminChangeRole(ctx, data) {
    const res = await adminChangeRole(data)
    return res
  },

  // 管理员：删除用户
  async adminDeleteAccount(ctx, data) {
    const res = await adminDeleteAccount(data)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

