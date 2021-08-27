import request from '@/utils/request'

export function getList() {
  return request({
    url: '/api/v1/cmdb/type_list',
    method: 'get'
  })
}
export function addType(data) {
  return request({
    url: '/api/v1/cmdb/add_type',
    method: 'put',
    data: data
  })
}
export function getType(data) {
  return request({
    url: '/api/v1/cmdb/type_info',
    method: 'get',
    params: data
  })
}
export function editType(data) {
  return request({
    url: '/api/v1/cmdb/edit_type',
    method: 'post',
    data: data
  })
}
export function getItems(data) {
  return request({
    url: '/api/v1/cmdb/get_type_items',
    method: 'get',
    params: data
  })
}
export function getItemInfo(id) {
  return request({
    url: '/api/v1/cmdb/item_info',
    method: 'get',
    params: { 'item_id': id }
  })
}
export function addItem(data) {
  return request({
    url: '/api/v1/cmdb/add_type_item',
    method: 'put',
    data: data
  })
}
export function editItem(data) {
  return request({
    url: '/api/v1/cmdb/edit_type_item',
    method: 'post',
    data: data
  })
}
export function getInstance(data) {
  return request({
    url: '/api/v1/cmdb/instance_lists',
    method: 'get',
    params: data
  })
}
export function addNewRecord(data) {
  return request({
    url: '/api/v1/cmdb/add_record',
    method: 'put',
    data: data
  })
}
export function editOldRecord(data) {
  return request({
    url: '/api/v1/cmdb/edit_record',
    method: 'post',
    data: data
  })
}
export function deleteRecord(data) {
  return request({
    url: '/api/v1/cmdb/delete_record',
    method: 'delete',
    params: data
  })
}
export function getRecordDetail(data) {
  return request({
    url: `/api/v1/cmdb/record_details/${data}`,
    method: 'get'
  })

}

