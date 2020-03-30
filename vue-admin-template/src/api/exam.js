import request from '@/utils/request'

// 开始考试接口
export function startExam(data) {
  return request({
    url: '/exam/startExam',
    method: 'post',
    data
  })
}
