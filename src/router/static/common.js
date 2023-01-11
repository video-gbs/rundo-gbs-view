const routers = [
  // {
  //   path: '/workTable',
  //   name: '综合工作台',
  //   meta: { title: '综合工作台', icon: 'zhgzt' },
  //   component: () => import('@/views/leftMenus/workTable/index')
  // },
  // {
  //   path: '/politicalInquiryManagement',
  //   name: '问政管理',
  //   meta: { title: '问政管理' },
  //   redirect: '/politicalList',
  //   // component: () => import('@/views/leftMenus/politicalInquiryManagement/index'),
  //   meta: { title: '问政管理', icon: 'wzgl' },
  //   children: [
  //     {
  //       path: '/politicalList',
  //       name: '问政列表',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/politicalInquiryManagement/politicalList/index'
  //         ),
  //       meta: { title: '问政列表', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/politicalAudit',
  //       name: '问政转移审核',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/politicalInquiryManagement/politicalAudit/index'
  //         ),
  //       meta: { title: '问政转移审核', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/politicalReply',
  //       name: '邀请回复审核',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/politicalInquiryManagement/politicalReply/index'
  //         ),
  //       meta: { title: '邀请回复审核', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/informationManagement',
  //   name: '展示信息管理',
  //   meta: { title: '展示信息管理' },
  //   redirect: '/roundChart',
  //   meta: { title: '展示信息管理', icon: 'zsxxgl' },
  //   children: [
  //     {
  //       path: '/roundChart',
  //       name: '轮播图管理',
  //       component: () =>
  //         import('@/views/leftMenus/informationManagement/roundChart/index'),
  //       meta: { title: '轮播图管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/roundChart/:id',
  //       name: '轮播图管理',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/informationManagement/roundChart/addOrEdit.vue'
  //         ),
  //       hidden: true,
  //       meta: { title: '轮播图管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/publicManagement',
  //       name: '公告管理',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/informationManagement/publicManagement/index'
  //         ),
  //       meta: { title: '公告管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/publicManagement/:id',
  //       name: '公告管理',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/informationManagement/publicManagement/addOrEdit'
  //         ),
  //       hidden: true,
  //       meta: { title: '公告管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/advertisementPicture',
  //       name: '广告图管理',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/informationManagement/advertisementPicture/index'
  //         ),
  //       meta: { title: '广告图管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/advertisementPicture/:id',
  //       name: '广告图管理',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/informationManagement/advertisementPicture/addOrEdit'
  //         ),
  //       hidden: true,
  //       meta: { title: '广告图管理', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/userManagement',
  //   name: '用户管理',
  //   meta: { title: '用户管理' },
  //   redirect: '/userManagementIndex',
  //   // component: () => import('@/views/leftMenus/userManagement/index'),
  //   meta: { title: '用户管理', icon: 'role' },
  //   children: [
  //     {
  //       path: '/userManagementIndex',
  //       name: '用户管理',
  //       component: () => import('@/views/leftMenus/userManagement/index'),
  //       meta: { title: '用户管理', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/systemManagement',
  //   name: '系统管理',
  //   meta: { title: '系统管理' },
  //   redirect: '/accountManagement',
  //   meta: { title: '系统管理', icon: 'sys' },
  //   children: [
  //     {
  //       path: '/accountManagement',
  //       name: '用户管理',
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/accountManagement/index'),
  //       meta: { title: '用户管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/roleManagement',
  //       name: '角色管理',
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/roleManagement/index'),
  //       meta: { title: '角色管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/unitManagement',
  //       name: '单位管理',
  //       component: () =>
  //         import('@/views/leftMenus/systemManagement/unitManagement/index'),
  //       meta: { title: '单位管理', icon: 'dashboard' }
  //     },
  //     {
  //       path: '/otherUnitManagement',
  //       name: '其他单位管理',
  //       component: () =>
  //         import(
  //           '@/views/leftMenus/systemManagement/otherUnitManagement/index'
  //         ),
  //       meta: { title: '其他单位管理', icon: 'dashboard' }
  //     }
  //   ]
  // }
]

export default routers
