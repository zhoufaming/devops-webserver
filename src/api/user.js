import request from '@/utils/request'
import qs from 'qs'
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/users/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: '/users/update',
    method: 'post',
    data: {
      username: data.username,
      password: data.password,
      email: data.email,
      is_active: data.is_active,
      nick_name: data.nick_name
    }
  })
}

export function getUsers(pageNo, pageSize, searchUsername) {
  return request({
    url: '/users/all',
    method: 'get',
    params: { page_no: pageNo,
      page_size: pageSize,
      search_username: searchUsername }
  })
}
