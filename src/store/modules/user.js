import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Session } from '@/utils/storage'
import router from '../../router'
import Layout from '@/layout/index'
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
    thirdPartyLogin1: false,
    // 类型路由
    typeRouter: [],
    // 运维系统类型路由
    sidebarRouter: [],
    // 配置类型路由
    // configTypeRouter: []
    permission: []
  }
}
const loadView = (viewPath) => {
  return (resolve) => require([`@/views${viewPath}`], resolve)
  // return () => import('@/views' + viewPath)
}

const filterRouter = (routers) => {
  return routers.filter((router) => {
    // 区分布局与视图文件，因为加载方式不同
    router.meta = { icon: router.icon, title: router.name }
    if (router.component === 'Layout') {
      router.component = Layout
    } else {
      router.component = loadView(router.component)
      // router.component = require([`@/views${routers.component}`])
    }
    // 判断是否存在子路由，并递归调用自己
    if (router.children && router.children.length) {
      router.children = filterRouter(router.children)
    }
    return true
  })
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
    state.showSidebar = showSidebar
  },
  SET_THIRDPARTYLOGIN: (state, thirdPartyLogin1) => {
    state.thirdPartyLogin1 = thirdPartyLogin1
  },
  SET_TYPEROUTER: (state, typeRouter) => {
    state.typeRouter = []
    state.typeRouter = typeRouter
  },

  SET_SIDEBARROUTER: (state, sidebarRouter) => {
    state.sidebarRouter = []
    state.sidebarRouter = sidebarRouter
  },

  SET_DYNAMICROUTERSMAP(state, routers) {
    const homeRouters = [
      {
        path: '/workTable/',
        name: 'workTable',
        component: () => import('@/views/leftMenus/workTable/index'),
        meta: { title: '首页', icon: 'sy' }
      }
    ]
    const restypeRouter = []
    state.init = true
    let routerMaps = filterRouter(routers)
    state.routerLists = []
    state.routerLists = routerMaps
    routerMaps.map((item) => {
      if (item.name === Session.get('resRouterName')) {
        state.sidebarRouter = item.children
        state.activeIndex = item.path
      }
      restypeRouter.push(item)
    })
    state.typeRouter = homeRouters.concat(restypeRouter)
    if (Session.get('isShowSideRouter') === 0) {
      console.log('isShowSideRouter111')
      state.rightWidth = true
      state.showSidebar = true
    } else {
      console.log('isShowSideRouter222')
      state.rightWidth = false
      state.showSidebar = false
    }

    // 最后追加404路由
    routerMaps.push({
      path: '*',
      component: () => import('@/views/404.vue')
    })
    // 追加路由
    // 这块是重点，如果直接使用addRoute是无效的
    routerMaps.forEach((item) => {
      router.addRoute(item)
    })
  },

  SET_ROUTERLISTS: (state, dynamicRouters) => {
    state.routerLists = []
    state.routerLists = dynamicRouters

    Session.set('dynamicRouters', JSON.stringify(dynamicRouters))
  },
  SET_INIT: (state, init) => {
    state.init = init
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
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

  changeThirdPartyLogin({ commit }, val) {
    commit('SET_THIRDPARTYLOGIN', val)
  },

  // 更新类型路由
  changeDynamicRouters({ commit }, val) {
    commit('SET_DYNAMICROUTERSMAP', val)
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
  },
  // 配置按钮权限路由
  changePermission({ commit }, val) {
    commit('SET_PERMISSION', val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
