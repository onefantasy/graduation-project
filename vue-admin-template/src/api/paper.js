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

// 更改试卷发布状态
export function changePublish(data) {
  return request({
    url: '/paper/changePublish',
    method: 'post',
    data
  })
}

// 获取教师首页试卷信息
export function getPapersAllCount() {
  return request({
    url: '/paper/getPapersAllCount',
    method: 'get'
  })
}

// 管理员：获取试卷列表
export function getAdminPaperList(data) {
  return request({
    url: '/paper/adminPapers',
    method: 'post',
    data
  })
}
