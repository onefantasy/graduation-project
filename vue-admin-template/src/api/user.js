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
