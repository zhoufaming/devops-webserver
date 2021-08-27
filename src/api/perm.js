import request from '@/utils/request'

export function getPerms(params) {
  return request({
    url: '/api/v1/perm/all',
    method: 'get',
    params: params
  })
}
export function addPerm(data) {
  return request({
    url: '/api/v1/perm/add_perm',
    method: 'put',
    data: data
  })
}
export function editPerm(data) {
  return request({
    url: `/api/v1/perm/edit_perm/${data.perm_id}`,
    method: 'post',
    data: data
  })
}
