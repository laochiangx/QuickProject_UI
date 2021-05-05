import request from '@/utils/request'
import Qs from 'qs'

const orgApi = {
  list: params => request({
    url: `system/org?${Qs.stringify(params)}`,
    method: 'get',
    data: { notLoading: true }
  }),
  listTree: params => request({
    url: `system/org/tree?${Qs.stringify(params)}`,
    method: 'get',
    data: { notLoading: true }
  }),
  save: data => request({
    url: `system/org`,
    method: 'post',
    data
  }),
  update: data => request({
    url: `system/org`,
    method: 'put',
    data
  }),
  listByUserId: userId => request({
    url: `system/org/listByUserId?${userId}`,
    method: 'get',
    data: { notLoading: true }
  }),
  getOne: userId => request({
    url: `system/org/${userId}`,
    method: 'get',
    data: { notLoading: true }
  }),
}

export default orgApi
