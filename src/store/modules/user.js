import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Router, { staticRouters } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 动态路由
    routerLists: [],
    init: false,
    roles: []
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
  SET_ROUTERLISTS: (state, routerLists) => {
    state.init = true
    // let routerMaps = filterRouter(routerLists)
    routerLists.push({
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true
    })
    const childComponent = []
    routerLists.forEach((item) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          let params = {}
          params = {
            path: child.path,
            meta: child.meta,
            name: child.name,
            // component: () => import(`@/views/${child.component}`),
            component: (resolve) =>
              require([`@/views/${child.component}`], resolve)
          }
          childComponent.push(params)
        })
        Router.options.routes.push({
          path: item.path,
          meta: item.meta,
          name: item.name,
          // component: () => import(`@/views/${item.component}`),
          component: (resolve) =>
            require([`@/views/${item.component}`], resolve),
          children: childComponent
        })
      } else {
        Router.options.routes.push({
          path: item.path,
          meta: item.meta,
          name: item.name,
          component: item.component
          // component: () => import(`@/views${item.component}`)
          // component: (resolve) =>
          //   require([`@/views/${item.component}`], resolve)
        })
      }
    })

    state.routerLists = routerLists
    Router.addRoutes(Router.options.routes)
    console.log('Router~~~~~~~~', Router)
    sessionStorage.setItem('dynamicRouters', JSON.stringify(routerLists))
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
  dynamicRouters({ commit }, routerLists) {
    // staticRouters.concat(routerLists)
    commit('SET_ROUTERLISTS', routerLists) // 进行路由拼接并存储
  },

  changeInit({ commit }, val) {
    commit('SET_INIT', val)
  },

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

/**
 * 格式化树形结构数据   生成 vue-router 层级路由表
 */
const loadView = (viewPath) => {
  // return () => import('@/views/' + viewPath)
  return () => require([`@/views/${viewPath}`])
}

const filterRouter = (routerMap) => {
  let resRouters = routerMap.filter((router) => {
    if (
      !['resourceManagement', 'login', 'workTable', 'redirect'].includes(
        router.name
      )
    ) {
      router.component = loadView(router.component)
    }
    if (router.children && router.children.length > 0) {
      router.children = filterRouter(router.children)
    }
    return true
  })
  return resRouters
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
