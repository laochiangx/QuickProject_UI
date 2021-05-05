import request from '@/utils/request'
import Qs from 'qs'

const tenantUserApi = {
  list: params => request({
    url: `system/tenant?${Qs.stringify(params)}`,
    method: 'get',
    data: { notLoading: true }
  }),
  update: data => request({
    url: `system/tenant`,
    method: 'put',
    data
  }),
  save: data => request({
    url: `system/tenant`,
    method: 'post',
    data
  }),
  remove: id => request({
    url: `system/tenant/${id}`,
    method: 'delete'
  }),
  status: status => request({
    url: `system/tenant/status/${status}`,
    method: 'put'
  })
}

export default tenantUserApi
