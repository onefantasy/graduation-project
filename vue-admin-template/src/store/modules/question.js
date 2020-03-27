import {
  saveQuestion,
  getPaperQuestions
} from '@/api/question'

const actions = {
  // 保存题目
  async saveQuestion(ctx, data) {
    const res = await saveQuestion(data)
    return res
  },

  // 根据试卷id获取该试卷的所有试题
  async getPaperQuestions(ctx, params) {
    const res = await getPaperQuestions(params)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
