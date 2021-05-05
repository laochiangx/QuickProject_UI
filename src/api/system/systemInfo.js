import request from '@/utils/request'
import Qs from 'qs'

const systemInfoApi = {
// 获取系统信息
    getOverView: params => request({
        url: `/dashboard/overview`,
        method: 'get',
        data: { notLoading: true }
      }),
      getDomains: params => request({
        url: `/bean/domains`,
        method: 'get',
        data: { notLoading: true }
      }),
      properties: params => request({
        url: `/bean/properties`,
        method: 'get',
        data: { notLoading: true }
      }),
      // let systemInfo= res.data.systemInfo
      // let jvmInfo=  res.data.jvmInfo
      // let heapMemoryInfo=  res.data.heapMemoryUsage
      // let  metaspaceInfo=  res.data.metaSpace
      // let classInfo=  res.data.classLoadingInfo
      // let threadInfo=  res.data.threadInfo
      // let garbageCollectorInfo=  res.data.garbageCollectorInfo
}

export default systemInfoApi
