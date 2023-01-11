import Vue from 'vue'
import Router from 'vue-router'
import staticRouters from './static/index'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const all = [0, 1, 2, 3, 4]
const admin = [0, 1]
const superAdmin = [0]
const none = []

const constantRoutes = [
  {
    path: '/login',
    meta: { title: '登录' },
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // 用于导航标签刷新页面
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workTable',
    children: [
      {
        path: '/workTable',
        name: '首页',
        component: () => import('@/views/leftMenus/workTable/index'),
        meta: { title: '首页', icon: 'zhgzt' }
      }
    ]
  },
  {
    path: '/resourceManagement',
    name: 'resourceManagement',
    component: Layout,
    // meta: { title: '展示信息管理' },
    redirect: '/equipment',
    meta: { title: '资源管理', icon: 'zygl' },
    author: superAdmin,
    children: [
      {
        path: '/equipment',
        name: 'equipment',
        author: superAdmin,
        component: () => import('@/views/leftMenus/resourceManagement/index'),
        meta: { title: '前端设备', icon: '' }
      },
      {
        path: '/addEquipment/:type',
        name: 'addEquipment',
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/components/AddEquipment.vue'
          ),
        author: superAdmin,
        hidden: true,
        meta: { title: '添加设备', icon: '' }
      },
      {
        path: '/activeDiscovery/:type',
        name: 'activeDiscovery',
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/components/ActiveDiscovery.vue'
          ),
        author: superAdmin,
        hidden: true,
        meta: { title: '主动发现', icon: '' }
      },
      {
        path: '/displayControlEquipment',
        name: 'displayControlEquipment',
        author: superAdmin,
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/displayControlEquipment.vue'
          ),
        meta: { title: '显示控制设备', icon: '' }
      }
    ]
  },
  {
    path: '/systemManagement',
    name: 'systemManagement',
    component: Layout,
    redirect: '/accountManagement',
    meta: { title: '组织管理', icon: 'zzgl' },
    author: superAdmin,
    children: [
      {
        path: '/securityArea',
        name: 'securityArea',
        author: superAdmin,
        component: () =>
          import('@/views/leftMenus/systemManagement/securityArea/index'),
        meta: { title: '安防区域', icon: '' }
      },
      {
        path: '/accountManagement',
        name: 'accountManagement',
        author: superAdmin,
        component: () =>
          import('@/views/leftMenus/systemManagement/accountManagement/index'),
        meta: { title: '用户管理', icon: '' }
      },
      {
        path: '/roleManagement',
        name: 'roleManagement',
        author: superAdmin,
        component: () =>
          import('@/views/leftMenus/systemManagement/roleManagement/index'),
        meta: { title: '角色管理', icon: '' }
      },
      {
        path: '/unitManagement',
        name: 'unitManagement',
        author: superAdmin,
        component: () =>
          import('@/views/leftMenus/systemManagement/unitManagement/index'),
        meta: { title: '部门管理', icon: '' }
      },
      {
        path: '/creatingRole/:type',
        name: '/creatingRole',
        component: () =>
          import(
            '@/views/leftMenus/resourceManagement/components/CreatingRole.vue'
          ),
        author: superAdmin,
        hidden: true,
        meta: { title: '新建角色', icon: '' }
      },
      {
        path: '/otherUnitManagement',
        name: 'OtherUnitManagement',
        author: superAdmin,
        hidden: true,
        component: () =>
          import(
            '@/views/leftMenus/systemManagement/otherUnitManagement/index'
          ),
        meta: { title: '单位账号管理', icon: '' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const pageAuthor = {}

function setPageAuthor(v) {
  v.forEach((i) => {
    if (i.author !== null && i.author !== undefined) {
      pageAuthor[i.name] = i.author
    }
    if (i.children) {
      setPageAuthor(i.children)
    }
  })
}
setPageAuthor(constantRoutes)
export { constantRoutes, pageAuthor }

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
