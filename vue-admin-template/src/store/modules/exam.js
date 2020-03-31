import {
  startExam,
  endExam,
  getExamedPaper
} from '@/api/exam'

const actions = {
  // 开始考试
  async startExam(ctx, data) {
    const res = await startExam(data)
    return res
  },

  // 结束考试
  async endExam(ctx, data) {
    const res = await endExam(data)
    return res
  },

  // 根据用户id获取其的考试记录
  async getExamedPaper(ctx, params) {
    const res = await getExamedPaper(params)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
