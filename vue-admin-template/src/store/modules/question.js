import {
  saveQuestion
} from '@/api/question'

const actions = {
  // 保存题目
  async saveQuestion(ctx, data) {
    const res = await saveQuestion(data)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
