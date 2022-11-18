
const routers = [
  {
    path: '/workTable',
    name: '综合工作台',
    meta: { title: '综合工作台' },
    component: () => import('@/views/leftMenus/workTable/index')
  },
  {
    path: '/politicalInquiryManagement',
    name: '问政管理',
    meta: { title: '问政管理' },
    component: () => import('@/views/leftMenus/politicalInquiryManagement/index')
  },
  {
    path: '/informationManagement',
    name: '展示信息管理',
    meta: { title: '展示信息管理' },
    component: () => import('@/views/leftMenus/informationManagement/index')
  },
  {
    path: '/userManagement',
    name: '用户管理',
    meta: { title: '用户管理' },
    component: () => import('@/views/leftMenus/userManagement/index')
  },
  {
    path: '/systemManagement',
    name: '系统管理',
    meta: { title: '系统管理' },
    component: () => import('@/views/leftMenus/systemManagement/index')
  }
]

export default routers

