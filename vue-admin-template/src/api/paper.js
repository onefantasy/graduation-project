import request from '@/utils/request'

// 创建试卷
export function createPaper(data) {
  return request({
    url: '/paper/create',
    method: 'post',
    data
  })
}

// 获取考过的试卷 和 创建过的试卷的信息
export function getPapers(params) {
  return request({
    url: '/paper/getPapers',
    method: 'get',
    params
  })
}

// 删除试卷
export function deletePaper(data) {
  return request({
    url: '/paper/detelePaper',
    method: 'post',
    data
  })
}

// 根据试卷id获取试卷信息
export function getPaperDetail(params) {
  return request({
    url: '/paper/getPaperDetail',
    method: 'get',
    params
  })
}
