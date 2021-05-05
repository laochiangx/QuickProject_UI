//  ui 加载插件
import { Loading } from 'element-ui'

// lodash 工具库 https://www.lodashjs.com/
import _ from 'lodash'

let loading

// 开始加载
const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

// 关闭加载
const closeLoading = () => {
  if (loading)loading.close()
}

// 提供给外部使用 , 全屏加载
export function showFullScreenLoading() {
  startLoading()
}

// 提供给外部使用 , 关闭加载
export function hideFullScreenLoading() {
  // lodash 防抖动调用函数
  closeLoading()
  // if (loading) _.debounce(closeLoading, 300)();
}
