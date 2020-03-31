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
