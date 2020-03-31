import {
  saveAnswerRecords
} from '@/api/answer'

const actions = {
  // 保存答题记录
  async saveAnswerRecords(ctx, data) {
    const res = await saveAnswerRecords(data)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
