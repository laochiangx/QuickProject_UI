import Vue from 'vue'

import Cookies from 'js-cookie'
// a modern alternative to CSS resets
import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'
// global css
import '@/styles/index.scss'


import App from './App'
import store from './store'
import router from './router'
// icon
import './icons'
// permission control
import './permission'
// global filters
import * as filters from './filters'

//require('@/mock/mock-server')

//img lazy load
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    loading: '/images/file/loading.gif',
})

Vue.use(Element, {
    // set element-ui default size
    size: Cookies.get('size') || 'small'
})



import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
