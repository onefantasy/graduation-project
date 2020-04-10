import {
  saveQuestion,
  getPaperQuestions,
  getCollecQuestions,
  deleteCollectedQuestion,
  getQuestionByQid
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
  },

  // 根据账号获取相应的题目
  async getCollecQuestions(ctx, params) {
    const res = await getCollecQuestions(params)
    return res
  },

  // 根据qid删除相应的收藏的试题
  async deleteCollectedQuestion(ctx, params) {
    const res = await deleteCollectedQuestion(params)
    return res
  },

  // 根据qid获取相应的试题信息
  async getQuestionByQid(ctx, params) {
    const res = await getQuestionByQid(params)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
