import request from '@/utils/request'

// 保存试题
export function saveQuestion(data) {
  return request({
    url: '/question/save',
    method: 'post',
    data
  })
}
