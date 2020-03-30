import {
  startExam
} from '@/api/exam'

const actions = {
  // 开始考试
  async startExam(ctx, data) {
    const res = await startExam(data)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
