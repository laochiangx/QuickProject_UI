import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  access_token: getToken(),
  userName: '',
  nickName: '',
  avatar: '',
  topMenu: [],
  menu: [],
  permission: [],
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.access_token = token
  },
  SET_NAME: (state, name) => {
    state.userName = name
  },
  SET_NICK_NAME: (state, name) => {
    state.nickName = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_TOP_MENU: (state, topMenu) => {
    state.topMenu = topMenu
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, notLoading: true }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取登录用户基本信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        const { username, nickName, avatar, roles, topMenu, menu, permission } = data
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar || 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1246207470,1516116328&fm=111&gp=0.jpg')
        commit('SET_NICK_NAME', nickName)
        commit('SET_MENU', menu)
        commit('SET_TOP_MENU', topMenu)
        commit('SET_PERMISSION', permission)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.access_token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_NICK_NAME', '')
        commit('SET_MENU', [])
        commit('SET_TOP_MENU', [])
        commit('SET_PERMISSION', [])
        removeToken()
        resetRouter()
        // 重置访问的视图和缓存的视图
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除token，退出登录需要
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      commit('SET_NICK_NAME', '')
      commit('SET_MENU', [])
      commit('SET_TOP_MENU', [])
      commit('SET_PERMISSION', [])
      removeToken()
      resolve()
    })
  },

  // 模板自带动态修改权限，暂时未用到
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
