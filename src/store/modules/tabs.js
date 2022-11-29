const state = {
  menuModule: 'workTable',
  activeTabsName: '',
  tabList: [],
}

const mutations  = {
  SET_TABLIST: (state, value )=> {
    state.tabList = value;
  },
  SET_ACTIVETABNAME: (state, value) => {
    state.activeTabsName = value;
  },
  SET_MENUMODULE: (state, value) => {
    state.menuModule = value;
  }
}

const actions = {
  setTabList({ commit },tabList) {
    commit('SET_TABLIST',tabList)
  },
  setActiveTabName({ commit },activeTabsName) {
    commit('SET_ACTIVETABNAME',activeTabsName)
  },
  setMenuModule({ commit }, menuModule) {
    commit('SET_MENUMODULE', menuModule)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
