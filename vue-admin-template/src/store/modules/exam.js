import {
  startExam,
  endExam,
  getExamedPaper,
  getExamRecordByAP
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
  },

  // 获取用户某次考试的详情
  async getExamRecordByAP(ctx, data) {
    const res = await getExamRecordByAP(data)
    return res
  }
}

export default {
  namespaced: true,
  actions
}
