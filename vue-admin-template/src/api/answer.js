import request from '@/utils/request'

// 保存考试的答题记录
export function saveAnswerRecords(data) {
  return request({
    url: '/answer/saveAnswerRecords',
    method: 'post',
    data
  })
}

// 根据eid获取考试记录
export function getAnswersByEid(params) {
  return request({
    url: '/answer/getAnswersByEid',
    method: 'get',
    params
  })
}
