//模拟获取后台路由(动态路由)
import Layout from '@/layout'
export function getRouters() {
  return new Promise((resolve, reject) => {
    // menuList  里面得参数自己定义（可以跟后端商量返回自己需要的格式）
    // 这点一定要和后端商量好，这个路由表完全由后端维护，格式正确可以事半功倍哦
    let menuList = [
      {
        path: '/resourceManagement',
        redirect: '/equipment',
        component: Layout,
        hidden: true,
        children: [
          {
            path: '/equipment',
            name: 'equipment',
            component: '/leftMenus/resourceManagement/index',
            meta: {
              icon: '',
              title: '前端设备'
            }
          },
          {
            path: '/addEquipment/:type',
            name: 'addEquipment',
            component:
              '/leftMenus/resourceManagement/components/AddEquipment.vue',
            meta: {
              icon: '',
              title: '添加设备'
            }
          },
          {
            path: '/displayControlEquipment',
            name: 'displayControlEquipment',
            component:
              '/leftMenus/resourceManagement/displayControlEquipment.vue',
            meta: {
              icon: '',
              title: '显示控制设备'
            }
          }
        ]
      }
    ]
    resolve(menuList)
  })
}
