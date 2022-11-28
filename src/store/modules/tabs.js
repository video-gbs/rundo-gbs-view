const state = {
  menuModule: 'home',
  activeTabsName: '',
  tabList: [],
}

const mutations = {
  GET_TABLIST: (state, value )=> {
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
  getTabList({ commit },tabList) {
    commit('GET_TABLIST',tabList)
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
