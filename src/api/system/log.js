import request from '@/utils/request'
import Qs from 'qs'

const systemLogApi = {
// 获取租户列表
    list: params => request({
        url: `/system/log?${Qs.stringify(params)}`,
        method: 'get',
        data: { notLoading: true }
      }),
      update: data => request({
        url: `system/log`,
        method: 'put',
        data
      }),
      save: data => request({
        url: `system/log`,
        method: 'post',
        data
      }),
      remove: id => request({
        url: `system/log/${id}`,
        method: 'delete'
      })

}

export default systemLogApi
