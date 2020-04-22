import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/info',
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/users/logout',
    method: 'post',
    data: { token }
  })
}

// 注册账号
export function register(data) {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}

// 设置用户信息
export function setInfo(data) {
  return request({
    url: '/users/setInfo',
    method: 'post',
    data
  })
}

// 更改密码
export function changePassword(data) {
  return request({
    url: '/users/changePassword',
    method: 'post',
    data
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/users/userList',
    method: 'get',
    params
  })
}

// 管理员：更改用户密码
export function adminChangePassword(data) {
  return request({
    url: '/users/adminChangePassword',
    method: 'post',
    data
  })
}

// 管理员：更改用户角色
export function adminChangeRole(data) {
  return request({
    url: '/users/adminChangeRole',
    method: 'post',
    data
  })
}

// 管理员：删除账号
export function adminDeleteAccount(data) {
  return request({
    url: '/users/adminDeleteAccount',
    method: 'post',
    data
  })
}
