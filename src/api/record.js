import request from '@/utils/request'

export function getRecords(pageNo, pageSize, searchInfo) {
  return request({
    url: '/api/v1/record/all',
    method: 'get',
    params: { page_no: pageNo,
      page_size: pageSize,
      search_info: searchInfo }
  })
}
