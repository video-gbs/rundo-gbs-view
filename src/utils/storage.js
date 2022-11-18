/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */

// 设置永久缓存
function set(k, v) {
  if (key[k]) {
    window.localStorage.setItem(key[k], JSON.stringify(v))
  } else {
    window.localStorage.setItem(k, JSON.stringify(v))
  }
}
// 获取永久缓存
function get(k) {
  if (key[k]) {
    const json = window.localStorage.getItem(key[k])
    return JSON.parse(json)
  }
  const json = window.localStorage.getItem(k)
  return JSON.parse(json)
}
// 移除永久缓存
function remove(k) {
  if (key[k]) {
    window.localStorage.removeItem(key[k])
  } else {
    window.localStorage.removeItem(k)
  }
}
// 移除全部永久缓存
function clear() {
  window.localStorage.clear()
}

function logout() {
  remove('appId')
  remove('token')
  remove('user')
  remove('route')
  remove('permission')
  remove('dict')
  remove('farmCode')
}

// 本地缓存key管理
const key = {
  token: 'MANAGE_USER_TOKEN', // 用户密令token
  route: 'MANAGE_USER_ROUTER', // 用户路由
  code: 'MANAGE_SYSTEM_CODE', // 平台项目代码
  permission: 'MANAGE_PERMISSION', // 用户权限
  user: 'MANAGE_USER', // 用户信息
  dict: 'MANAGE_DICT', // 字典表
  plate: 'MANAGE_PLATE', // 板块
  farmCode: 'MANAGE_FARM_CODE' // 农场代码
}

function init() {
  const fun = {}
  Object.keys(key).forEach(k => {
    const n = k.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    fun['set' + n] = (data) => {
      if (data) {
        set(key[k], data)
      } else {
        remove(key[k])
      }
    }
    fun['get' + n] = () => {
      return get(key[k])
    }
  })
  return fun
}

export const Local = {
  set,
  get,
  remove,
  clear,
  logout,
  // 存取特殊key值
  ...init()
  // setToken(token) {
  //   set(key.token, token)
  // },
  // getToken() {
  //   return get(key.token)
  // },
  // setRoute(router) {
  //   if (router) {
  //     set(key.route, router)
  //   } else {
  //     remove(key.route)
  //   }
  // },
  // getRoute() {
  //   return get(key.route)
  // },
  // setCode(code) {
  //   if (code) {
  //     set(key.code, code)
  //   } else {
  //     remove(key.code)
  //   }
  // },
  // getCode() {
  //   return get(key.code)
  // },
  // setPermission(perm) {
  //   if (perm) {
  //     set(key.perm, perm)
  //   } else {
  //     remove(key.perm)
  //   }
  // },
  // getPermission() {
  //   return get(key.perm)
  // },
  // setUser(user) {
  //   if (user) {
  //     set(key.user, user)
  //   } else {
  //     remove(key.user)
  //   }
  // },
  // getUser() {
  //   return get(key.user)
  // },
  // setDict(dict) {
  //   if (dict) {
  //     set(key.dict, dict)
  //   } else {
  //     remove(key.dict)
  //   }
  // },
  // getDict(name) {
  //   const dict = get(key.dict)
  //   if (name && dict) {
  //     return dict[name]
  //   }
  //   return dict
  // }
}

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
  // 设置临时缓存
  set(key, val) {
    window.sessionStorage.setItem(key, JSON.stringify(val))
  },
  // 获取临时缓存
  get(key) {
    const json = window.sessionStorage.getItem(key)
    return JSON.parse(json)
  },
  // 移除临时缓存
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  // 移除全部临时缓存
  clear() {
    window.sessionStorage.clear()
  }
}

