<template>
  <div class="home-page-content">
    <Header class="wrapper-header" />
    <div class="page-container">
      <div class="container-top">
        <LineFont
          class="line-font"
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />

        <ul class="home-ul-top">
          <li v-for="(top, index) in topLists" :key="index" class="top-li">
            <div
              class="top-li-div"
              :style="{ background: colorList[index] }"
            ></div>
            <span class="top-li-span">{{ top.name }}</span>
          </li>
        </ul>
      </div>
      <div class="container-middle">
        <div class="container-middle-left">
          <LineFont
            class="line-font"
            :line-title="lineTitle2"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
          <ul class="home-ul-top">
            <li
              v-for="(item1, index1) in appList"
              :key="index1"
              class="top-li"
              @click="goContentList('应用', item1, index1)"
            >
              <div
                class="top-li-div"
                :style="{
                  background:
                    'url(' +
                    require('../../../assets/imgs/' + item1.appIcon + '.png') +
                    ') center center no-repeat'
                }"
              ></div>
              <span class="top-li-span">{{ item1.appName }}</span>
            </li>
          </ul>
        </div>
        <div class="container-middle-right">
          <LineFont
            class="line-font"
            :line-title="lineTitle3"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
          <ul class="home-ul-top">
            <li
              v-for="(item2, index2) in devOpsList"
              :key="index2"
              class="top-li"
              @click="goContentList('运维', item2, index2)"
            >
              <!-- :style="{ background: colorList2[index2] }" -->
              <div
                class="top-li-div"
                :style="{
                  background:
                    'url(' +
                    require('../../../assets/imgs/' + item2.appIcon + '.png') +
                    ') center center no-repeat'
                }"
              ></div>
              <span class="top-li-span">{{ item2.appName }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="container-bottom">
        <LineFont
          class="line-font"
          :line-title="lineTitle4"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
        <ul class="home-ul-top">
          <li
            v-for="(item3, index3) in configList"
            :key="index3"
            class="top-li"
            @click="goContentList('配置', item3, index3)"
          >
            <div
              class="top-li-div"
              :style="{
                background:
                  'url(' +
                  require('../../../assets/imgs/' + item3.appIcon + '.png') +
                  ') center center no-repeat'
              }"
            ></div>
            <span class="top-li-span">{{ item3.appName }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Header } from '@/layout/components'
import LineFont from '@/components/LineFont'
import { getHomeLists, getTypeTreeMenus } from '@/api/method/home'
import store from '@/store/index'
import router from '../../../router/index'
import { Local } from '@/utils/storage'

export default {
  components: {
    LineFont,
    Header
  },
  data() {
    return {
      params: {},
      weatherListShow: false,
      notificationShow: false,
      todoListShow: false,
      overviewShow: false,
      statisticalShow: false,
      weatherList: {},
      homeLists: {},
      notification: [],
      statisticalData: [],
      colorList: [
        'linear-gradient(179deg, #00BCB6 0%, #009993 100%)',
        'linear-gradient(180deg, #F77062 0%, #FE5196 100%)',
        'linear-gradient(317deg, #4481EB 0%, #04BEFE 100%)'
      ],
      colorList1: [
        // require('../../../assets/imgs/mid1.png'),
        'linear-gradient(167deg, #F77062 0%, #FE5196 100%)',
        'linear-gradient(180deg, #FFBC08 0%, #FFCC99 100%)',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
      ],
      colorList2: [
        // 'linear-gradient(180deg, #38C07C 0%, #2E7753 100%)',
        // require('../../../assets/imgs/peizhi.png'),
        'linear-gradient(180deg, #00BCB6 0%, #009993 100%)',
        'linear-gradient(173deg, #54FFB5 0%, #259094 100%)',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
      ],
      colorList3: [
        // require('../../../assets/imgs/bottom1.png'),
        // require('../../../assets/imgs/bottom2.png'),
        'linear-gradient(147deg, #4481EB 0%, #04BEFE 100%)',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
      ],
      topLists: [
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      appList: [
        {
          name: '实时监控'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      devOpsList: [
        {
          name: '系统管理'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      configList: [
        {
          name: '组织管理'
        },
        {
          name: '合同管理'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      lineTitle: {
        title: '常用',
        notShowSmallTitle: false
      },
      lineTitle2: {
        title: '应用',
        notShowSmallTitle: false
      },
      lineTitle3: {
        title: '运维',
        notShowSmallTitle: false
      },
      lineTitle4: {
        title: '配置',
        notShowSmallTitle: false
      },
      textStyle: {
        fontSize: '24px',
        fontFamily: 'Microsoft YaHei-Regular, Microsoft YaHei',
        fontWeight: 400,
        color: '#fff'
      },
      lineBlueStyle: {
        width: '4px',
        height: '17px',
        borderRadius: '2px',
        background:
          'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)'
      },

      // 应用类型路由
      appTypeRouter: [],
      // 运维系统类型路由
      systemTypeRouter: [],
      // 配置类型路由
      configTypeRouter: [],
      // 侧边栏路由
      sideBarRouterList: [],
      sideBarRouterList1: [],
      sideBarRouterList2: [],
      sideBarRouterList3: []
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await getHomeLists()
        .then((res) => {
          if (res.code === 0) {
            const { appList, configList, devOpsList } = res.data
            this.devOpsList = devOpsList
            this.appList = appList
            this.configList = configList
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    /**
     * 格式化树形结构数据   生成 vue-router 层级路由表
     */

    saveComponents(val, data, name) {
      // console.log('val~~~~~~~~~~~~~~~~~~~~~~~~', val)
      if (data && data.length > 0) {
        const homeRouters = [
          {
            path: '/workTable',
            name: 'workTable',
            component: () => import('@/views/leftMenus/workTable/index'),
            meta: { title: '首页', icon: 'sy' }
          }
        ]
        if (val === 1) {
          data.map((item) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((child) => {
                let params = {}
                params = {
                  path: child.path,
                  meta: child.meta,
                  name: child.name,
                  hidden: child.hidden === 0 ? true : false,
                  component: (resolve) =>
                    require([`@/views${child.component}`], resolve)
                }
                this.appTypeRouter.push(params)
              })
            }
          })
          this.appTypeRouter = homeRouters.concat(this.appTypeRouter)

          store.dispatch('user/changeActiveIndex', this.appTypeRouter[1].path)
          console.log('this.appTypeRouter', this.appTypeRouter)
        } else {
          data.map((item4) => {
            let params1 = {}
            params1 = {
              path: item4.path,
              meta: item4.meta,
              name: item4.name,
              component: (resolve) =>
                require([`@/views${item4.component}`], resolve)
            }
            this.systemTypeRouter.push(params1)
            this.configTypeRouter.push(params1)
            // 侧边栏路由
            if (item4.children && item4.children.length > 0) {
              item4.children.forEach((child) => {
                let params2 = {}
                params2 = {
                  path: child.path,
                  meta: child.meta,
                  name: child.name,
                  hidden: child.hidden === 1 ? true : false,
                  component: (resolve) =>
                    require([`@/views${child.component}`], resolve)
                }

                this.sideBarRouterList.push(params2)
              })
            }
          })
          switch (name) {
            case '/resourceManagement':
              data.map((item1) => {
                if (
                  item1.children &&
                  item1.children.length > 0 &&
                  name === item1.path
                ) {
                  item1.children.forEach((child1) => {
                    let resourceManagement = {}
                    resourceManagement = {
                      path: child1.path,
                      meta: child1.meta,
                      name: child1.name,
                      hidden: child1.hidden === 1 ? true : false,
                      component: (resolve) =>
                        require([`@/views${child.component}`], resolve)
                    }

                    this.sideBarRouterList1.push(resourceManagement)
                  })
                }
              })

              store.dispatch(
                'user/changeSidebarRouter',
                this.sideBarRouterList1
              )

              console.log(1, this.sideBarRouterList1)
              this.$router.push({ path: this.sideBarRouterList1[0].path })
              break
            case '/systemManagement':
              data.map((item2) => {
                if (
                  item2.children &&
                  item2.children.length > 0 &&
                  name === item2.path
                ) {
                  item2.children.forEach((child2) => {
                    let systemManagement = {}
                    systemManagement = {
                      path: child2.path,
                      meta: child2.meta,
                      name: child2.name,
                      hidden: child2.hidden === 1 ? true : false,
                      component: (resolve) =>
                        require([`@/views${child.component}`], resolve)
                    }

                    this.sideBarRouterList2.push(systemManagement)
                  })
                }
              })

              store.dispatch(
                'user/changeSidebarRouter',
                this.sideBarRouterList2
              )
              console.log(2, this.sideBarRouterList2)
              this.$router.push({ path: this.sideBarRouterList2[0].path })
              break
            case '/moduleManageMent':
              data.map((item3) => {
                if (
                  item3.children &&
                  item3.children.length > 0 &&
                  name === item3.path
                ) {
                  item3.children.forEach((child3) => {
                    let moduleManageMent = {}
                    moduleManageMent = {
                      path: child3.path,
                      meta: child3.meta,
                      name: child3.name,
                      hidden: child3.hidden === 1 ? true : false,
                      component: (resolve) =>
                        require([`@/views${child.component}`], resolve)
                    }

                    this.sideBarRouterList3.push(moduleManageMent)
                  })
                }
              })

              store.dispatch(
                'user/changeSidebarRouter',
                this.sideBarRouterList3
              )

              console.log(3, this.sideBarRouterList3)
              this.$router.push({ path: this.sideBarRouterList3[0].path })
              break
            default:
              break
          }
          if (val === 3) {
            this.systemTypeRouter = homeRouters.concat(this.systemTypeRouter)

            console.log(
              'this.systemTypeRouter',
              this.systemTypeRouter,
              this.sideBarRouterList
            )
            store.dispatch(
              'user/changeActiveIndex',
              this.systemTypeRouter[1].path
            )
            store.dispatch('user/changeSidebarRouter', this.sideBarRouterList)
          } else {
            this.configTypeRouter = homeRouters.concat(this.configTypeRouter)
            console.log('this.configTypeRouter', this.configTypeRouter)
          }
        }
      }
    },
    goContentList(name, item, index) {
      switch (name) {
        case '应用':
          Local.set('tree_type', 1)
          getTypeTreeMenus(1).then((res1) => {
            if (res1.code === 0) {
              const resRouter1 = []
              res1.data.map((item) => {
                resRouter1.push(item)
              })

              store.dispatch('user/dynamicRouters', resRouter1)
              store.dispatch('user/changeInit', false)
              store.dispatch('user/changeRightWidth', false)
              store.dispatch('user/changeShowSidebar', false)
              // this.$emit('changeSidebarHiddenStatus', true)

              this.saveComponents(1, resRouter1)
              store.dispatch('user/changeTypeRouter', this.appTypeRouter)

              this.$router.push({ path: resRouter1[0].children[0].path })
            }
          })
          break
        case '运维':
          Local.set('tree_type', 3)
          getTypeTreeMenus(3).then((res2) => {
            if (res2.code === 0) {
              const resRouter2 = []
              res2.data.map((item) => {
                resRouter2.push(item)
              })
              store.dispatch('user/changeInit', false)
              store.dispatch('user/dynamicRouters', resRouter2)
              store.dispatch('user/changeRightWidth', true)
              store.dispatch('user/changeShowSidebar', true)
              // this.$emit('changeSidebarHiddenStatus', false)

              this.saveComponents(3, resRouter2)
              store.dispatch('user/changeTypeRouter', this.systemTypeRouter)

              this.$router.push({ path: resRouter2[0].children[0].path })
            }
          })
          break
        case '配置':
          console.log(111111111, item)
          Local.set('tree_type', 2)
          getTypeTreeMenus(2).then((res3) => {
            if (res3.code === 0) {
              const resRouter3 = []
              res3.data.map((item) => {
                resRouter3.push(item)
              })
              store.dispatch('user/dynamicRouters', resRouter3)
              store.dispatch('user/changeInit', false)
              store.dispatch('user/changeRightWidth', true)
              store.dispatch('user/changeShowSidebar', true)
              // this.$emit('changeSidebarHiddenStatus', false)

              store.dispatch('user/changeActiveIndex', item.appUrl)
              this.saveComponents(2, resRouter3, item.appUrl)
              store.dispatch('user/changeTypeRouter', this.configTypeRouter)
            }
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page-content {
  height: 100%;
  .wrapper-header {
    height: 3.5rem;
  }
}

.page-container {
  height: calc(100% - 56px);
  background: #f2f2f2;
  background-image: url('../../../assets/imgs/homebg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  margin: 0 !important;
  // min-height: calc(100vh - 98px);
  // padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
  .container-top {
    // width: 100%;
    height: 184px;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 12px;
    margin: 24px 24px 0 24px;
    .line-font {
      margin: 10px 0 0 35px;
    }
    .home-ul-top {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      .top-li {
        text-align: center;
        margin-right: 60px;
        .top-li-div {
          width: 64px;
          height: 64px;
          box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.16);
          border-radius: 4px;
          cursor: pointer;
        }
        .top-li-span {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .container-middle {
    width: 100%;
    height: 184px;
    border-radius: 12px;
    margin: 24px 24px 0 24px;
    display: flex;
    justify-content: space-between;
    .container-middle-left {
    }
    .container-middle-right {
    }
    .line-font {
      margin: 10px 0 0 35px;
    }
    .home-ul-top {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      .top-li {
        text-align: center;
        margin-right: 60px;
        .top-li-div {
          width: 64px;
          height: 64px;
          box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.16);
          border-radius: 4px;
          cursor: pointer;
          // background-repeat: 'no-repeat';
          // background-size: 'cover';
        }
        .top-li-span {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .container-bottom {
    width: 100%;
    height: 184px;
    border-radius: 12px;
    margin: 24px 24px 0 24px;
    .line-font {
      margin: 10px 0 0 35px;
    }
    .home-ul-top {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      .top-li {
        text-align: center;
        margin-right: 60px;
        .top-li-div {
          width: 64px;
          height: 64px;
          box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.16);
          border-radius: 4px;
          cursor: pointer;
        }
        .top-li-span {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
