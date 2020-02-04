import {
  createPaper,
  getPapers,
  deletePaper,
  getPaperDetail
} from '@/api/paper'

const actions = {
  // 创建试卷
  createPaper({ commit }, data) {
    return new Promise((resolve, reject) => {
      createPaper(data).then(res => {
        resolve(res)
      }).catch(err => {
        console.log(err)
      })
    })
  },

  getPapers({ commit }, params) {
    return new Promise((resolve, reject) => {
      getPapers(params).then(res => {
        resolve(res)
      }).catch(err => {
        console.log(err)
      })
    })
  },

  // 删除试卷
  detelePaper({ commit }, data) {
    return new Promise((resolve, reject) => {
      deletePaper(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 根据试卷id获取试卷详情
  getPaperDetail({ commit }, params) {
    return new Promise((resolve, reject) => {
      getPaperDetail(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}
