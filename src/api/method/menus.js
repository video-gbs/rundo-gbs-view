//模拟获取后台路由(动态路由)
import Layout from '@/layout'
export function getRouters() {
  return new Promise((resolve, reject) => {
    // menuList  里面得参数自己定义（可以跟后端商量返回自己需要的格式）
    // 这点一定要和后端商量好，这个路由表完全由后端维护，格式正确可以事半功倍哦
    let menuList = [
      {
        path: '/resourceManagement',
        name: 'resourceManagement',
        meta: { title: '资源管理', icon: 'zygl' },
        redirect: '/equipment',
        component: Layout,
        hidden: true,
        children: [
          {
            path: '/equipment',
            name: 'equipment',
            component: 'leftMenus/systemManagement/unitManagement/index',
            meta: {
              icon: 'ssjk',
              title: '实施监控'
            }
          },
          {
            path: '/unitManagement',
            name: 'unitManagement',
            component: 'leftMenus/systemManagement/unitManagement/index',
            meta: {
              icon: 'lxhf',
              title: '录像回放'
            }
          },
          {
            path: '/securityArea',
            name: 'securityArea',
            component:
              'leftMenus/resourceManagement/displayControlEquipment.vue',
            meta: {
              icon: 'bjcl',
              title: '报警处理'
            }
          },
          {
            path: '/applicationManagement',
            name: 'applicationManagement',
            component:
              'leftMenus/resourceManagement/displayControlEquipment.vue',
            meta: {
              icon: 'dzdt',
              title: '电子地图'
            }
          },
          {
            path: '/applicationManagement1',
            name: 'applicationManagement1',
            component:
              'leftMenus/resourceManagement/displayControlEquipment.vue',
            meta: {
              icon: 'dsq',
              title: '电视墙'
            }
          }
        ]
      }
    ]
    resolve(menuList)
  })
}
