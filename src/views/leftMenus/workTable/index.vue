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
              @click="
                !isGoContentListClicked
                  ? goContentList(lineTitle2.title, item1, index1)
                  : ''
              "
            >
              <div
                v-cloak
                class="top-li-div"
                :style="{
                  background: getBackground(item1)
                }"
              ></div>
              <span class="top-li-span">{{ item1.name }}</span>
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
              @click="
                !isGoContentListClicked
                  ? goContentList(lineTitle3.title, item2, index2)
                  : ''
              "
            >
              <div
                v-cloak
                class="top-li-div"
                :style="{
                  background: getBackground(item2)
                }"
              ></div>
              <span class="top-li-span">{{ item2.name }}</span>
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
            @click="
              !isGoContentListClicked
                ? goContentList(lineTitle4.title, item3, index3)
                : ''
            "
          >
            <div
              v-cloak
              class="top-li-div"
              :style="{
                background: getBackground(item3)
              }"
            ></div>
            <span class="top-li-span">{{ item3.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Header } from '@/layout/components'
import LineFont from '@/components/LineFont'
import { getTypeTreeMenus, getHomeResource } from '@/api/method/home'

import { getMenuLists } from '@/api/method/user'

import store from '@/store/index'
import router from '../../../router/index'
import { Local } from '@/utils/storage'

import { antiShake } from '@/utils/index.js'

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
      appList: [],
      devOpsList: [],
      configList: [],
      lineTitle: {
        title: '常用',
        notShowSmallTitle: false
      },
      lineTitle2: {
        title: '',
        notShowSmallTitle: false
      },
      lineTitle3: {
        title: '',
        notShowSmallTitle: false
      },
      lineTitle4: {
        title: '',
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
      sideBarRouterList3: [],
      windowWidth: null,
      isGoContentListClicked: false
    }
  },
  watch: {
    windowWidth: {
      handler: function (val, oldVal) {
        const h = document.getElementsByTagName('HTML')[0]
        h.style.setProperty('--web-zoom', this.windowWidth / 1920)

        this.$forceUpdate()
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.initMenuLists()
    this.windowWidth = document.documentElement.clientWidth
    window.onresize = this.throttle(this.setScale, 500, 500)
  },
  methods: {
    async getHomeMenu() {
      await getHomeMenu()
        .then((res) => {
          if (res.data.code === 0) {
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async initMenuLists() {
      await getMenuLists({ levelNumStart: 1, levelNumEnd: 3 })
        .then((res) => {
          if (res.data.code === 0) {
            this.lineTitle2.title = res.data.data[0].name
            this.lineTitle3.title = res.data.data[1].name
            this.lineTitle4.title = res.data.data[2].name
            this.appList = res.data.data[0].childList
            this.devOpsList = res.data.data[1].childList
            this.configList = res.data.data[2].childList
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    throttle(method, delay, duration) {
      var timer = null
      var begin = new Date()
      return function () {
        var context = this
        var args = arguments
        var current = new Date()
        clearTimeout(timer)
        if (current - begin >= duration) {
          method.apply(context, args)
          begin = current
        } else {
          timer = setTimeout(function () {
            method.apply(context, args)
          }, delay)
        }
      }
    },
    setScale() {
      // 以1920px为标准宽度
      this.windowWidth = document.documentElement.clientWidth
    },
    getBackground(item) {
      return item.icon
        ? 'url(' +
            require('../../../assets/imgs/' + item.icon + '.png') +
            ') center center no-repeat'
        : ''
    },

    /**
     * 格式化树形结构数据   生成 vue-router 层级路由表
     */

    saveComponents(val, data, name) {
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
            let params = {}
            params = {
              path: item.path,
              meta: { icon: item.icon, title: item.name },
              name: item.name,
              hidden: item.hidden === 0 ? true : false,
              component: (resolve) =>
                require([`@/views${item.component}`], resolve)
            }
            this.appTypeRouter.push(params)
          })
          this.appTypeRouter = homeRouters.concat(this.appTypeRouter)
        } else if (val === 2) {
          data.map((item4) => {
            let params1 = {}
            params1 = {
              path: item4.path,
              meta: { icon: item4.icon, title: item4.name },
              name: item4.name,
              redirect: item4.childList ? item4.childList[0].path : '',
              component: (resolve) =>
                require([`@/views${item4.component}`], resolve)
            }
            this.configTypeRouter.push(params1)
            // 侧边栏路由
            if (item4.childList && item4.childList.length > 0) {
              item4.childList.forEach((child) => {
                let params2 = {}
                params2 = {
                  path: child.path,
                  meta: { icon: child.icon, title: child.name },
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
                  item1.childList &&
                  item1.childList.length > 0 &&
                  name === item1.path
                ) {
                  item1.childList.forEach((child1) => {
                    let resourceManagement = {}
                    resourceManagement = {
                      path: child1.path,
                      meta: { icon: child1.icon, title: child1.name },
                      name: child1.name,
                      hidden: child1.hidden === 1 ? true : false,
                      component: (resolve) =>
                        require([`@/views${child.component}`], resolve)
                    }

                    this.sideBarRouterList1.push(resourceManagement)
                  })
                }
                if (item1.name === '资源管理') {
                  this.$router.push({
                    path: item1.childList ? item1.childList[0].path : ''
                  })
                }
              })

              store.dispatch(
                'user/changeSidebarRouter',
                this.sideBarRouterList1
              )
              break
            case '/organizationManagement':
              data.map((item2) => {
                if (
                  item2.childList &&
                  item2.childList.length > 0 &&
                  name === item2.path
                ) {
                  item2.childList.forEach((child2) => {
                    let systemManagement = {}
                    systemManagement = {
                      path: child2.path,
                      meta: { icon: child2.icon, title: child2.name },
                      name: child2.name,
                      hidden: child2.hidden === 1 ? true : false,
                      component: (resolve) =>
                        require([`@/views${child.component}`], resolve)
                    }

                    this.sideBarRouterList2.push(systemManagement)
                  })
                }
                if (item2.name === '组织管理') {
                  this.$router.push({
                    path: item2.childList ? item2.childList[0].path : ''
                  })
                }
              })

              store.dispatch(
                'user/changeSidebarRouter',
                this.sideBarRouterList2
              )
              break
            case '/moduleManageMent':
              data.map((item3) => {
                if (
                  item3.childList &&
                  item3.childList.length > 0 &&
                  name === item3.path
                ) {
                  item3.childList.forEach((child3) => {
                    let moduleManageMent = {}
                    moduleManageMent = {
                      path: child3.path,
                      meta: { icon: child3.icon, title: child3.name },
                      name: child3.name,
                      hidden: child3.hidden === 1 ? true : false,
                      component: (resolve) =>
                        require([`@/views${child.component}`], resolve)
                    }

                    this.sideBarRouterList3.push(moduleManageMent)
                  })
                }
                if (item3.name === '服务管理') {
                  this.$router.push({
                    path: item3.childList ? item3.childList[0].path : ''
                  })
                }
              })

              store.dispatch(
                'user/changeSidebarRouter',
                this.sideBarRouterList3
              )
              break
            default:
              break
          }

          this.configTypeRouter = homeRouters.concat(this.configTypeRouter)
        } else {
          data.map((item3) => {
            let params3 = {}
            params3 = {
              path: item3.path,
              meta: { icon: item3.icon, title: item3.name },
              name: item3.name,
              redirect: item3.redirect,
              component: (resolve) =>
                require([`@/views${item3.component}`], resolve)
            }
            this.systemTypeRouter.push(params3)
            // 侧边栏路由
            if (item3.childList && item3.childList.length > 0) {
              item3.childList.forEach((child3) => {
                let params4 = {}
                params4 = {
                  path: child3.path,
                  meta: { icon: child3.icon, title: child3.name },
                  name: child3.name,
                  hidden: child3.hidden === 1 ? true : false,
                  component: (resolve) =>
                    require([`@/views${child3.component}`], resolve)
                }

                this.sideBarRouterList.push(params4)
              })
            }
          })

          this.systemTypeRouter = homeRouters.concat(this.systemTypeRouter)
          store.dispatch(
            'user/changeActiveIndex',
            this.systemTypeRouter[1].path
          )
          store.dispatch('user/changeSidebarRouter', this.sideBarRouterList)
        }
      }
    },
    goContentList: antiShake(function (name, data, index) {
      this.isGoContentListClicked = true
      switch (name) {
        case '应用':
          Local.set('tree_type', 1)

          console.log('this.appList', this.appList)

          store.dispatch('user/dynamicRouters', this.appList)
          store.dispatch('user/changeInit', false)
          store.dispatch('user/changeRightWidth', false)
          store.dispatch('user/changeShowSidebar', false)

          this.saveComponents(1, this.appList)
          store.dispatch('user/changeTypeRouter', this.appTypeRouter)

          store.dispatch('user/changeActiveIndex', data.path)
          this.$router.push({ path: data.path })
          break
        case '运维':
          Local.set('tree_type', 3)
          getMenuLists({ levelNumStart: 1, levelNumEnd: 4 }).then((res2) => {
            if (res2.data.code === 0) {
              const resData = res2.data.data[1].childList

              store.dispatch('user/changeInit', false)
              store.dispatch('user/dynamicRouters', resData)
              store.dispatch('user/changeRightWidth', true)
              store.dispatch('user/changeShowSidebar', true)

              this.saveComponents(3, resData)
              store.dispatch('user/changeTypeRouter', this.systemTypeRouter)

              this.$router.push({ path: resData[0].childList[0].path })

              Local.set('funcId', resData[0].childList[0].id)
            }
          })
          break
        case '配置':
          Local.set('tree_type', 2)
          getMenuLists({ levelNumStart: 1, levelNumEnd: 4 }).then((res3) => {
            if (res3.data.code === 0) {
              const resRouter3 = res3.data.data[2].childList

              store.dispatch('user/dynamicRouters', resRouter3)
              store.dispatch('user/changeInit', false)
              store.dispatch('user/changeRightWidth', true)
              store.dispatch('user/changeShowSidebar', true)

              store.dispatch('user/changeActiveIndex', data.path)

              this.saveComponents(2, resRouter3, data.path)

              store.dispatch('user/changeTypeRouter', this.configTypeRouter)
            }
          })
          break
        default:
          break
      }
      setTimeout(() => {
        this.isGoContentListClicked = false
      }, 10000)
    })
  }
}
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
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
    // justify-content: space-between;
    justify-content: flex-start;
    .container-middle-left {
      width: 50%;
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
