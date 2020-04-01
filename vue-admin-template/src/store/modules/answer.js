import {
  saveAnswerRecords,
  getAnswersByEid
} from '@/api/answer'

const actions = {
  // 保存答题记录
  async saveAnswerRecords(ctx, data) {
    const res = await saveAnswerRecords(data)
    return res
  },

  // 根据eid获取考试记录
  async getAnswersByEid(ctx, params) {
    const res = await getAnswersByEid(params)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
