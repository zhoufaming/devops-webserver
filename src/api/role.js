import request from '@/utils/request'
export function getRoles() {
  return request({
    url: '/api/v1/role/list',
    method: 'get'
  })
}
export function roleAdd(data) {
  return request({
    url: '/api/v1/role/add_role',
    method: 'put',
    data: data
  })
}
export function getUsers(data) {
  return request({
    url: '/api/v1/role/user_lists',
    params: data
  })
}
export function getMenus(data) {
  return request({
    url: '/api/v1/role/menu_lists',
    params: data
  })
}
export function getPerms(data) {
  return request({
    url: '/api/v1/role/perm_lists',
    params: data
  })
}
export function submitUsers(data) {
  return request({
    url: '/api/v1/role/edit_users',
    method: 'post',
    data: data
  })
}
export function submitPerms(data) {
  return request({
    url: '/api/v1/role/edit_perms',
    method: 'post',
    data: data
  })
}
export function submitMenus(data) {
  return request({
    url: '/api/v1/role/edit_menus',
    method: 'post',
    data: data
  })
}
