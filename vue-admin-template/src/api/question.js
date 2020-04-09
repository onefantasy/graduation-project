import request from '@/utils/request'

// 保存试题
export function saveQuestion(data) {
  return request({
    url: '/question/save',
    method: 'post',
    data
  })
}

// 根据试卷id获取该试卷的所有试题
export function getPaperQuestions(params) {
  return request({
    url: '/question/getPaperQuestions',
    method: 'get',
    params
  })
}

// 根据账号获取相应收藏题目的列表
export function getCollecQuestions(params) {
  return request({
    url: '/question/getCollecQuestions',
    method: 'get',
    params
  })
}
