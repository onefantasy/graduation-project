import request from '@/utils/request'

// 开始考试接口
export function startExam(data) {
  return request({
    url: '/exam/startExam',
    method: 'post',
    data
  })
}

// 结束考试可接口
export function endExam(data) {
  return request({
    url: '/exam/endExam',
    method: 'post',
    data
  })
}

// 根据用户id获取其的考试记录
export function getExamedPaper(params) {
  return request({
    url: '/exam/getExamedPaper',
    method: 'get',
    params
  })
}

// 根据用户某次考试的详情
export function getExamRecordByAP(data) {
  return request({
    url: '/exam/getExamRecordByAP',
    method: 'post',
    data
  })
}

// 根据paperId获取某张试卷的考试整体情况（教师专用接口，用于统计考试情况）
export function getExamOverallByPid(params) {
  return request({
    url: '/exam/getExamOverallByPid',
    method: 'get',
    params
  })
}

// 更改分数
export function changeScore(data) {
  return request({
    url: '/exam/changeScore',
    method: 'post',
    data
  })
}
