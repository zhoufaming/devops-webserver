import request from '@/utils/request'

export function getMenuLists() {
  return request({
    url: '/api/v1/menu/menu_lists',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/api/v1/menu/add_menu',
    method: 'put',
    data: data
  })
}

export function editMenu(data) {
  return request({
    url: '/api/v1/menu/edit_menu',
    method: 'post',
    data: data
  })
}
export function getMenuInfo(menu_id) {
  return request({
    url: '/api/v1/menu/get_menu_info',
    params: menu_id
  })
}
