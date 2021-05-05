import request from '@/utils/request'
import Qs from 'qs'

const roleApi = {
  list: params => request({
    url: `system/role?${Qs.stringify(params)}`,
    method: 'get',
    data: { notLoading: true }
  }),
  getOne: roleId => request({
    url: `system/role/${roleId}`,
    method: 'get',
    data: { notLoading: true }
  }),
  save: data => request({
    url: `system/role`,
    method: 'post',
    data
  }),
  update: data => request({
    url: `system/role`,
    method: 'put',
    data
  }),
  status: (roleId, status) => request({
    url: `system/role/${roleId}/status/${status}`,
    method: 'put'
  }),
  remove: id => request({
    url: `system/role/${id}`,
    method: 'delete'
  })
}

export default roleApi
