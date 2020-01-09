import request from '@/utils/request'

export function upTemplate(params) {
  return request({
    url: '/template-info/add',
    method: 'post',
    data: params
  })
}

export function getTemplate(params) {
  return request({
    url: '/template-info/findPage',
    method: 'post',
    data: params,
    params
  })
}

export function getTemplateData(params) {
  return request({
    url: '/template-info/readFile  ',
    method: 'post',
    data: params
  })
}

export function delTemplate(params) {
  return request({
    url: '/template-info/del',
    method: 'post',
    data: params
  })
}

export function getDefaultTemp() {
  return request({
    url: '/template-info/findOneDefault',
    method: 'post'
  })
}

export function changeDefaultTemp(params) {
  return request({
    url: '/template-info/edit',
    method: 'post',
    data: params
  })
}

export function printTemplate(params) {
  return request({
    url: '/vehicle-weight/printWeight',
    method: 'post',
    data: params
  })
}

export function findAttribute() {
  return request({
    url: '/template-info/findAttribute',
    method: 'post'
  })
}
