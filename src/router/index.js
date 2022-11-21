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
export const constantRoutes = [
  {
    path: '/login',
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
  // {
  //   path: '/workTable',
  //   name: '综合工作台',
  //   meta: { title: '综合工作台' },
  //   component: () => import('@/views/leftMenus/workTable/index')
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/workTable',
    children: [{
      path: '/workTable',
      name: '综合工作台',
      component: () => import('@/views/leftMenus/workTable/index'),
      meta: { title: '综合工作台', icon: 'zhgzt' }
    }]

  },
  // component: () => import('@/views/leftMenus/workTable/index'),
  // children: [
  // {
  //   path: '/workTable',
  //   name: '综合工作台',
  //   component: () => import('@/views/leftMenus/workTable/index'),
  //   meta: { title: '综合工作台', icon: 'dashboard' }
  // },
  {
    path: '/politicalInquiryManagement',
    name: '问政管理',
    meta: { title: '问政管理' },
    component: Layout,
    redirect: '/politicalList',
    // component: () => import('@/views/leftMenus/politicalInquiryManagement/index'),
    meta: { title: '问政管理', icon: 'wzgl' },
    children: [
      {
        path: '/politicalList',
        name: '问政列表',
        component: () => import('@/views/leftMenus/politicalInquiryManagement/politicalList/index'),
        meta: { title: '问政列表', icon: 'dashboard' }
      },
      {
        path: '/politicalAudit',
        name: '问政转移审核',
        component: () => import('@/views/leftMenus/politicalInquiryManagement/politicalAudit/index'),
        meta: { title: '问政转移审核', icon: 'dashboard' }
      },
      {
        path: '/politicalReply',
        name: '邀请回复审核',
        component: () => import('@/views/leftMenus/politicalInquiryManagement/politicalReply/index'),
        meta: { title: '邀请回复审核', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/informationManagement',
    name: '展示信息管理',
    component: Layout,
    meta: { title: '展示信息管理' },
    redirect: '/roundChart',
    meta: { title: '展示信息管理', icon: 'zsxxgl' },
    children: [
      {
        path: '/roundChart',
        name: '轮播图管理',
        component: () => import('@/views/leftMenus/informationManagement/roundChart/index'),
        meta: { title: '轮播图管理', icon: 'dashboard' }
      },
      {
        path: '/roundChart/:id',
        name: '轮播图管理',
        component: () => import('@/views/leftMenus/informationManagement/roundChart/addOrEdit.vue'),
        hidden: true,
        meta: { title: '轮播图管理', icon: 'dashboard' }
      },
      {
        path: '/publicManagement',
        name: '公告管理',
        component: () => import('@/views/leftMenus/informationManagement/publicManagement/index'),
        meta: { title: '公告管理', icon: 'dashboard' }
      },
      {
        path: '/publicManagement/:id',
        name: '公告管理',
        component: () => import('@/views/leftMenus/informationManagement/publicManagement/addOrEdit'),
        hidden: true,
        meta: { title: '公告管理', icon: 'dashboard' }
      },
      {
        path: '/advertisementPicture',
        name: '广告图管理',
        component: () => import('@/views/leftMenus/informationManagement/advertisementPicture/index'),
        meta: { title: '广告图管理', icon: 'dashboard' }
      },
      {
        path: '/advertisementPicture/:id',
        name: '广告图管理',
        component: () => import('@/views/leftMenus/informationManagement/advertisementPicture/addOrEdit'),
        hidden: true,
        meta: { title: '广告图管理', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/userManagement',
    name: '用户管理',
    component: Layout,
    meta: { title: '用户管理' },
    redirect: '/userManagement',
    // component: () => import('@/views/leftMenus/userManagement/index'),
    meta: { title: '用户管理', icon: 'role' },
    children: [
      {
        path: '/userManagement',
        name: '用户管理',
        component: () => import('@/views/leftMenus/userManagement/index'),
        meta: { title: '用户管理', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/systemManagement',
    name: '系统管理',
    meta: { title: '系统管理' },
    component: Layout,
    redirect: '/accountManagement',
    meta: { title: '系统管理', icon: 'sys' },
    children: [
      {
        path: '/accountManagement',
        name: '账号管理',
        component: () => import('@/views/leftMenus/systemManagement/accountManagement/index'),
        meta: { title: '账号管理', icon: 'dashboard' }
      },
      {
        path: '/roleManagement',
        name: '角色管理',
        component: () => import('@/views/leftMenus/systemManagement/roleManagement/index'),
        meta: { title: '角色管理', icon: 'dashboard' }
      },
      {
        path: '/unitManagement',
        name: '单位管理',
        component: () => import('@/views/leftMenus/systemManagement/unitManagement/index'),
        meta: { title: '单位管理', icon: 'dashboard' }
      }
    ]
  },
  // {
  //   path: '/politicalDetail',
  //   // component: Layout,
  //   // meta: { title: '问政详情' },
  //   component: () => import('@/views/leftMenus/politicalInquiryManagement/politicalList/politicalDetail/index')
  // },
  // ]
  // },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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
