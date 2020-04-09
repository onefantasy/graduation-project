import {
  createPaper,
  getPapers,
  deletePaper,
  getPaperDetail,
  changePublish,
  getPapersAllCount
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
  },

  // 更改试卷发布状态
  async changePublish(ctx, data) {
    const res = await changePublish(data)
    return res
  },

  // 获取教师首页试卷信息
  async getPapersAllCount(ctx) {
    const res = await getPapersAllCount()
    return res
  }
}

export default {
  namespaced: true,
  actions
}
