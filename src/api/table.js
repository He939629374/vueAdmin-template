import request from '@/utils/request'

export function getList(params) {
  return request({
    //url: '/table/list',
    url:'https://easy-mock.com/mock/5a77d8ca2b34a719baf5768f/example/list',
    method: 'get',
    params
  })
}
