import request from '@/utils/request'
import Qs from 'qs'

const menuApi = {
  list: params => request({
    url: `system/menu?${Qs.stringify(params)}`,
    method: 'get',
    data: { notLoading: true }
  }),
  listTree: params => request({
    url: `system/menu/tree?${Qs.stringify(params)}`,
    method: 'get',
    data: { notLoading: true }
  }),
  save: data => request({
    url: `system/menu`,
    method: 'post',
    data
  }),
  update: data => request({
    url: `system/menu`,
    method: 'put',
    data
  })
}

export default menuApi
