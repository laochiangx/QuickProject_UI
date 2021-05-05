import elementVariables from '@/styles/element-variables.scss'
import variables from '@/styles/variables.scss'
import defaultSettings from '@/settings'
import { getThemeColor, setThemeColor, removeThemeColor } from '@/utils/setting'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: elementVariables.theme,
  menuActiveText: variables.menuActiveText,
  dynamicThemeColor: getThemeColor(),
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      if (key === 'theme' || key === 'menuActiveText') {
        setThemeColor(value)
      }
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

