import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Router, { staticRouters } from '@/router'
import Layout from '@/layout'
import { Local } from '@/utils/storage'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 动态路由
    routerLists: [],
    init: false,
    roles: [],
    activeIndex: '',
    rightWidth: false,
    showSidebar: false,
    // 类型路由
    typeRouter: [],
    // 运维系统类型路由
    sidebarRouter: []
    // 配置类型路由
    // configTypeRouter: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ACTIVEINDEX: (state, activeIndex) => {
    state.activeIndex = activeIndex
  },
  SET_RIGHTWIDTH: (state, rightWidth) => {
    state.rightWidth = rightWidth
  },
  SET_SHOWSIDEBAR: (state, showSidebar) => {
    state.showSidebar = []
    state.showSidebar = showSidebar
  },
  // SET_APPTYPEROUTER: (state, showSidebar) => {
  //   state.showSidebar = showSidebar
  // },
  // SET_SYSTEMTYPEROUTER: (state, showSidebar) => {
  //   state.showSidebar = showSidebar
  // },
  SET_TYPEROUTER: (state, typeRouter) => {
    state.typeRouter = []
    state.typeRouter = typeRouter
  },

  SET_SIDEBARROUTER: (state, sidebarRouter) => {
    state.sidebarRouter = []
    state.sidebarRouter = sidebarRouter
  },

  SET_ROUTERLISTS: (state, dynamicRouters) => {
    state.routerLists = []
    state.routerLists = dynamicRouters
    Local.set('dynamicRouters', JSON.stringify(dynamicRouters))
  },
  SET_INIT: (state, init) => {
    state.init = init
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //       if (!data) {
  //         reject('Token验证失败,请重新登录.')
  //       } else {
  //         const { userName, avatar, roles, mobile } = data
  //         if (!userName) {
  //           commit('SET_NAME', mobile)
  //         } else {
  //           commit('SET_NAME', userName)
  //         }
  //         const avatarStr = avatar || './avatar.png'
  //         // commit('SET_NAME', mobile)
  //         commit('SET_AVATAR', avatarStr)
  //         // commit('SET_AVATAR', avatar)
  //         commit('SET_ROLES', roles)
  //         session.set(data)
  //         resolve(data)
  //       }
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // 动态设置路由 此为设置设置途径
  dynamicRouters({ commit }, dynamicRouters) {
    commit('SET_ROUTERLISTS', dynamicRouters) // 进行路由拼接并存储
  },

  changeInit({ commit }, val) {
    commit('SET_INIT', val)
  },

  changeActiveIndex({ commit }, val) {
    commit('SET_ACTIVEINDEX', val)
  },

  changeRightWidth({ commit }, val) {
    commit('SET_RIGHTWIDTH', val)
  },

  changeShowSidebar({ commit }, val) {
    commit('SET_SHOWSIDEBAR', val)
  },

  // 类型路由
  changeTypeRouter({ commit }, val) {
    commit('SET_TYPEROUTER', val)
  },

  // 类型路由
  changeSidebarRouter({ commit }, val) {
    commit('SET_SIDEBARROUTER', val)
  },
  // // 运维系统类型路由
  // changeSystemTypeRouter({ commit }, val) {
  //   commit('SET_SHOWSIDEBAR', val)
  // },
  // // 配置类型路由
  // changeConfigTypeRouter({ commit }, val) {
  //   commit('SET_SHOWSIDEBAR', val)
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
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
