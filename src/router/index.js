import Vue from 'vue'
import Router from 'vue-router'
import { Local } from '@/utils/storage'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import { getRouters } from '@/api/method/menus'

Vue.use(Router)

NProgress.configure({ showSpinner: false })

export const staticRouters = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/workTable',
    name: 'workTable',
    component: () => import('@/views/leftMenus/workTable/index'),
    meta: { title: '首页', icon: 'zhgzt' }
  }
  // {
  //   path: '/redirect',
  //   name: 'redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  // {
  //   path: '/404',
  //   component: () => import('@/views/404.vue'),
  //   hidden: true
  // },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/workTable',
  //   name: 'workTable',
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/workTable',
  //       name: 'workTable',
  //       component: () => import('@/views/leftMenus/workTable/index'),
  //       meta: { title: '首页', icon: 'zhgzt' }
  //     }
  //   ]
  // }
  // {
  //   path: '/resourceManagement',
  //   name: 'resourceManagement',
  //   component: Layout,
  //   redirect: '/equipment',
  //   meta: { title: '资源管理', icon: 'zygl' },
  //   author: superAdmin,
  //   children: [
  //     {
  //       path: '/equipment',
  //       name: 'equipment',
  //       author: superAdmin,
  //       component: () => import('@/views/leftMenus/resourceManagement/index'),
  //       meta: { title: '前端设备', icon: '' }
  //     },
  //     {
  //       path: '/addEquipment/:type',
  //       name: 'addEquipment',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/AddEquipment.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '添加设备', icon: '' }
  //     },
  //     {
  //       path: '/editEquipment',
  //       name: 'editEquipment',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/EditEquipment.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '编辑设备', icon: '' }
  //     },
  //     {
  //       path: '/activeDiscovery/:type',
  //       name: 'activeDiscovery',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/ActiveDiscovery.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '添加角色', icon: '' }
  //     },
  //     {
  //       path: '/channelDiscovery/:type',
  //       name: 'channelDiscovery',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/ChannelDiscovery.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '添加通道', icon: '' }
  //     },
  //     {
  //       path: '/displayControlEquipment',
  //       name: 'displayControlEquipment',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/displayControlEquipment.vue'
  //         ),
  //       meta: { title: '显示控制设备', icon: '' }
  //     },
  //     {
  //       path: '/live',
  //       name: 'live',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/resourceManagement/live.vue'),
  //       meta: { title: '视频设备', icon: '' }
  //     }
  //   ]
  // },
  // {
  //   path: '/systemManagement',
  //   name: 'systemManagement',
  //   component: Layout,
  //   redirect: '/accountManagement',
  //   meta: { title: '组织管理', icon: 'zzgl' },
  //   author: superAdmin,
  //   children: [
  //     {
  //       path: '/securityArea',
  //       name: 'securityArea',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/securityArea/index'),
  //       meta: { title: '安防区域', icon: '' }
  //     },
  //     {
  //       path: '/accountManagement',
  //       name: 'accountManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/accountManagement/index'),
  //       meta: { title: '用户管理', icon: '' }
  //     },
  //     {
  //       path: '/user/:type',
  //       name: 'user',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/accountManagement/components/userAdd.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '新增用户', icon: '' }
  //     },
  //     {
  //       path: '/editUser/:type',
  //       name: 'editUser',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/accountManagement/components/userEdit.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '编辑用户', icon: '' }
  //     },
  //     {
  //       path: '/roleManagement',
  //       name: 'roleManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/roleManagement/index'),
  //       meta: { title: '角色管理', icon: '' }
  //     },
  //     {
  //       path: '/unitManagement',
  //       name: 'unitManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/unitManagement/index'),
  //       meta: { title: '部门管理', icon: '' }
  //     },
  //     {
  //       path: '/creatingRole/:type',
  //       name: '/creatingRole',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
  //         ),
  //       author: superAdmin,
  //       hidden: true,
  //       meta: { title: '新建角色', icon: '' }
  //     },
  //     {
  //       path: '/otherUnitManagement',
  //       name: 'OtherUnitManagement',
  //       author: superAdmin,
  //       hidden: true,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/otherUnitManagement/index'
  //         ),
  //       meta: { title: '单位账号管理', icon: '' }
  //     }
  //   ]
  // },
  // {
  //   path: '/management',
  //   name: 'management',
  //   component: Layout,
  //   redirect: '/applicationManagement',
  //   meta: { title: '应用管理', icon: 'sys' },
  //   author: superAdmin,
  //   children: [
  //     {
  //       path: '/applicationManagement',
  //       name: 'applicationManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/applicationManagement.vue'
  //         ),
  //       meta: { title: '应用管理', icon: '' }
  //     },
  //     {
  //       path: '/menuManagement',
  //       name: 'menuManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/menuManagement.vue'
  //         ),
  //       meta: { title: '菜单管理', icon: '' }
  //     },
  //     {
  //       path: '/apiManagement',
  //       name: 'apiManagement',
  //       author: superAdmin,
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/system/apiManagement.vue'),
  //       meta: { title: '接口管理', icon: '' }
  //     },
  //     {
  //       path: '/dataDictionary',
  //       name: 'dataDictionary',
  //       author: superAdmin,
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/system/dataDictionary.vue'
  //         ),
  //       meta: { title: '数据字典', icon: '' }
  //     }
  //     // {
  //     //   path: '/creatingRole/:type',
  //     //   name: 'creatingRole',
  //     //   component: () =>
  //     //     import(
  //     //       '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
  //     //     ),
  //     //   author: superAdmin,
  //     //   hidden: true,
  //     //   meta: { title: '新建角色', icon: '' }
  //     // },
  //     // {
  //     //   path: '/otherUnitManagement',
  //     //   name: 'OtherUnitManagement',
  //     //   author: superAdmin,
  //     //   hidden: true,
  //     //   component: () =>
  //     //     import(
  //     //       '@/views/leftMenus/systemManagement/otherUnitManagement/index'
  //     //     ),
  //     //   meta: { title: '单位账号管理', icon: '' }
  //     // }
  //   ]
  // },
  // ,

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

// const pageAuthor = {}

// function setPageAuthor(v) {
//   v.forEach((i) => {
//     if (i.author !== null && i.author !== undefined) {
//       pageAuthor[i.name] = i.author
//     }
//     if (i.children) {
//       setPageAuthor(i.children)
//     }
//   })
// }
// setPageAuthor(constantRoutes)
// export { constantRoutes, pageAuthor }

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

// export default new Router({
//   mode: 'history',
//   scrollBehavior: () => ({ y: 0 }),
//   routes: staticRouters
// })

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: staticRouters
})

//路由重复的问题 解决
// router.$addRoutes = (params) => {
//   console.log('params',params)
//   router.matcher = new Router({
//     // 重置路由规则
//     scrollBehavior: () => ({
//       y: 0
//     })
//   }).matcher
//   router.addRoutes(params) // 添加路由
// }

const whiteList = ['/login']

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
})
// 取到浏览器出现网址的最后"/"出现的后边的字符
const getLastUrl = (str, yourStr) => str.slice(str.lastIndexOf(yourStr))

// let isToken = true
router.beforeEach(async (to, from, next) => {
  console.log('进入路由守卫')
  const hasToken = Local.getToken()
  if (hasToken) {
    // 如果有 token 并且不是登录页的时候，进行权限获取
    console.log('获取to.path的值', to.path)
    if (to.path !== '/login') {
      const lastUrl = getLastUrl(window.location.href, '/')

      console.log('获取lastUrl的值', lastUrl)
      console.log('获取init的值', store.state.user.init)
      console.log('获取vuex的值', store.state.user.routerLists)

      if (!store.state.user.init) {
        //从vuex中获取动态路由
        // //动态路由循环解析和添加
        let accessRouteses = []
        if (lastUrl !== '/workTable' && to.path !== '/workTable') {
          accessRouteses = JSON.parse(Local.get('dynamicRouters'))
          console.log('刷新页面的时候动态路由获取', accessRouteses)

          const homeRouters = [
            {
              path: '/workTable',
              name: 'workTable',
              component: () => import('@/views/leftMenus/workTable/index'),
              meta: { title: '首页', icon: 'sy' }
            }
          ]
          let appTypeRouter = []
          let systemTypeRouter = []
          let configTypeRouter = []
          let sideBarRouterList = []
          let sideBarRouterList1 = []
          let sideBarRouterList2 = []
          let sideBarRouterList3 = []

          console.log('获取tree_type的值', Local.get('tree_type'))

          if (Local.get('tree_type') === 1) {
            const childComponent1 = []
            accessRouteses.map((item1) => {
              if (item1.children && item1.children.length > 0) {
                item1.children.forEach((child4) => {
                  let params2 = {}
                  params2 = {
                    path: child4.path,
                    meta: child4.meta,
                    name: child4.name,
                    hidden: child4.hidden === 1 ? true : false,
                    component: (resolve) =>
                      require([`@/views${child4.component}`], resolve)
                  }
                  appTypeRouter.push(params2)
                  childComponent1.push(params2)
                })
                const temp1 = {
                  name: item1.name,
                  path: item1.path,
                  meta: item1.meta,
                  redirect: item1.redirect,
                  component: Layout,
                  children: childComponent1
                }
                console.log('获取temp1的值', temp1)
                router.addRoute(temp1)
                router.options.routes.push(temp1)
              }
            })

            appTypeRouter = homeRouters.concat(appTypeRouter)
            store.dispatch('user/changeActiveIndex', appTypeRouter[1].path)
            // store.dispatch('user/dynamicRouters', appTypeRouter)
            store.dispatch('user/changeTypeRouter', appTypeRouter)
            store.dispatch('user/changeShowSidebar', false)
            store.dispatch('user/changeActiveIndex', appTypeRouter[1].path)
          } else if (Local.get('tree_type') === 3) {
            const childComponent4 = []
            accessRouteses.map((item4) => {
              let params1 = {}
              params1 = {
                path: item4.path,
                meta: item4.meta,
                name: item4.name,
                component: (resolve) =>
                  require([`@/views${item4.component}`], resolve)
              }
              systemTypeRouter.push(params1)
              // 侧边栏路由
              if (item4.children && item4.children.length > 0) {
                item4.children.forEach((child4) => {
                  let params2 = {}
                  params2 = {
                    path: child4.path,
                    meta: child4.meta,
                    name: child4.name,
                    hidden: child4.hidden === 1 ? true : false,
                    component: (resolve) =>
                      require([`@/views${child4.component}`], resolve)
                  }

                  sideBarRouterList.push(params2)
                  childComponent4.push(params2)
                })
                const temp4 = {
                  name: item4.name,
                  path: item4.path,
                  meta: item4.meta,
                  redirect: item4.redirect,
                  component: Layout,
                  children: childComponent4
                }
                console.log('获取temp4的值', temp4)
                router.addRoute(temp4)
                router.options.routes.push(temp4)
              }
            })
            systemTypeRouter = homeRouters.concat(systemTypeRouter)
            store.dispatch('user/changeActiveIndex', systemTypeRouter[1].path)
            store.dispatch('user/changeSidebarRouter', sideBarRouterList)
            // store.dispatch('user/dynamicRouters', systemTypeRouter)
            store.dispatch('user/changeTypeRouter', systemTypeRouter)
            store.dispatch('user/changeShowSidebar', true)
          } else {
            const childComponent2 = []

            const childComponent3 = []

            const childComponent4 = []
            accessRouteses.map((item2) => {
              switch (item2.path) {
                case '/resourceManagement':
                  if (item2.children && item2.children.length > 0) {
                    item2.children.forEach((child2) => {
                      let resourceManagement = {}
                      resourceManagement = {
                        path: child2.path,
                        meta: child2.meta,
                        name: child2.name,
                        hidden: child2.hidden,
                        component: (resolve) =>
                          require([`@/views${child2.component}`], resolve)
                      }

                      sideBarRouterList1.push(resourceManagement)
                      childComponent2.push(resourceManagement)
                    })
                    const temp2 = {
                      name: item2.name,
                      path: item2.path,
                      meta: item2.meta,
                      redirect: item2.redirect,
                      component: Layout,
                      children: childComponent2
                    }
                    console.log('获取temp4的值', temp2)
                    router.addRoute(temp2)
                    router.options.routes.push(temp2)
                    configTypeRouter = configTypeRouter.concat([temp2])
                  }

                  console.log(
                    'sideBarRouterList1~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
                    sideBarRouterList1
                  )

                  store.dispatch('user/changeSidebarRouter', sideBarRouterList1)
                  store.dispatch(
                    'user/changeTypeRouter',
                    homeRouters.concat(configTypeRouter)
                  )
                  // store.dispatch('user/changeActiveIndex', configTypeRouter[0].path)
                  // router.push({ path: sideBarRouterList1[0].path })
                  break
                case '/systemManagement':
                  if (item2.children && item2.children.length > 0) {
                    item2.children.forEach((child2) => {
                      let systemManagement = {}
                      systemManagement = {
                        path: child2.path,
                        meta: child2.meta,
                        name: child2.name,
                        hidden: child2.hidden,
                        component: (resolve) =>
                          require([`@/views${child2.component}`], resolve)
                      }

                      sideBarRouterList2.push(systemManagement)
                      childComponent3.push(systemManagement)
                    })
                    const temp3 = {
                      name: item2.name,
                      path: item2.path,
                      meta: item2.meta,
                      redirect: item2.redirect,
                      component: Layout,
                      children: childComponent3
                    }
                    console.log('获取temp4的值', temp3)
                    router.addRoute(temp3)
                    router.options.routes.push(temp3)
                    configTypeRouter = configTypeRouter.concat([temp3])
                  }

                  console.log(
                    'sideBarRouterList2~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
                    sideBarRouterList2
                  )

                  store.dispatch('user/changeSidebarRouter', sideBarRouterList2)
                  store.dispatch(
                    'user/changeTypeRouter',
                    homeRouters.concat(configTypeRouter)
                  )
                  // store.dispatch('user/changeActiveIndex', configTypeRouter[1].path)
                  // router.push({ path: sideBarRouterList2[0].path })
                  break
                case '/moduleManageMent':
                  if (item2.children && item2.children.length > 0) {
                    item2.children.forEach((child2) => {
                      let moduleManageMent = {}
                      moduleManageMent = {
                        path: child2.path,
                        meta: child2.meta,
                        name: child2.name,
                        hidden: child2.hidden,
                        component: (resolve) =>
                          require([`@/views${child2.component}`], resolve)
                      }

                      sideBarRouterList3.push(moduleManageMent)
                      childComponent4.push(moduleManageMent)
                    })
                    const temp4 = {
                      name: item2.name,
                      path: item2.path,
                      meta: item2.meta,
                      redirect: item2.redirect,
                      component: Layout,
                      children: childComponent4
                    }
                    console.log('获取temp3的值', temp4)
                    router.addRoute(temp4)
                    router.options.routes.push(temp4)
                    configTypeRouter = configTypeRouter.concat([temp4])
                  }

                  console.log(
                    'sideBarRouterList3~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
                    sideBarRouterList3
                  )

                  store.dispatch('user/changeSidebarRouter', sideBarRouterList3)

                  store.dispatch(
                    'user/changeTypeRouter',
                    homeRouters.concat(configTypeRouter)
                  )

                  // store.dispatch('user/changeActiveIndex', configTypeRouter[2].path)
                  // router.push({ path: sideBarRouterList3[0].path })
                  break
                default:
                  break
              }
            })

            console.log('最终的路由值', configTypeRouter)
            // store.dispatch(
            //   'user/changeTypeRouter',
            //   homeRouters.concat(configTypeRouter)
            // )

            // store.dispatch('user/dynamicRouters', configTypeRouter)
            store.dispatch('user/changeShowSidebar', true)
            if (
              lastUrl === '/gatewayModuleManagement' ||
              lastUrl === '/ModuleManagement' ||
              lastUrl.indexOf('/streamMediaAssociated') === 0
            ) {
              store.dispatch('user/changeActiveIndex', configTypeRouter[2].path)
            } else if (
              lastUrl === '/equipment' ||
              lastUrl === '/addEquipment' ||
              lastUrl === '/registrationList' ||
              lastUrl === '/channelDiscovery' ||
              lastUrl.indexOf('/editEquipment') === 0 ||
              lastUrl.indexOf('/editChannel') === 0
            ) {
              store.dispatch('user/changeActiveIndex', configTypeRouter[0].path)
            } else {
              store.dispatch('user/changeActiveIndex', configTypeRouter[1].path)
            }
          }
          console.log('刷新后的最终路由', router)

          store.dispatch('user/changeInit', true)
        } else {
          accessRouteses = await store.state.user.routerLists

          console.log('首页点击的时候动态路由获取', accessRouteses)

          const childComponent = []
          accessRouteses.forEach((item) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((child) => {
                // 组装路由配置
                const childTemp = {
                  name: child.name,
                  path: child.path,
                  meta: child.meta,
                  hidden: child.hidden === 1 ? true : false,
                  component: (resolve) =>
                    require([`@/views${child.component}`], resolve)
                }
                childComponent.push(childTemp)
              })
              const temp = {
                name: item.name,
                path: item.path,
                meta: item.meta,
                redirect: item.redirect,
                component: Layout,
                children: childComponent
              }
              router.addRoute(temp)
              router.options.routes.push(temp)
            } else {
              const elseTemp = {
                name: item.name,
                path: item.path,
                meta: item.meta,
                redirect: item.redirect,
                component: (resolve) =>
                  require([`@/views${item.component}`], resolve)
              }
              router.addRoute(elseTemp)
              router.options.routes.push(elseTemp)
            }
          })
          console.log('首页点击后的最终路由', router)

          store.dispatch('user/changeInit', true)
        }
        next({ ...to, replace: true })
      } else {
        console.log(12345678)
      }
    } else {
      next('/workTable')
    }
  } else {
    if (to.path !== '/login') {
      console.log('不在登录页跳转')
      next('/login')
    } else {
      console.log('在登录页跳转')
      next()
    }
  }
  next()
})

/**
 * 格式化树形结构数据   生成 vue-router 层级路由表
 */
const routerCom = (viewPath) => {
  return () => require([`@/views/${viewPath}`])
}

const routerChildren = (children) => {
  children.forEach((v) => {
    v.component = routerCom(v.component)
    if (v.children !== undefined) {
      v.children = routerChildren(v.children)
    }
  })
  return children
}

// 如果跳往登录页，则转到首页
function isLogin(to, next, callback) {
  if (to.path === '/login') {
    next('/')
  } else {
    callback()
  }
}

router.afterEach(() => {
  NProgress.done()
})

export default router
