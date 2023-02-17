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
      }
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.init()
    Local.set('changRight_width', true)
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
    // bacImage(name, item, index) {
    //   const imgUrl = require(`../../../assets/imgs/${item.appIcon}.png`)
    //   // require('../../../assets/imgs/mid1.png')
    //   switch (name) {
    //     case '应用':
    //       // if (index === 0) {
    //       return {
    //         background: 'url(' + imgUrl + ') center center no-repeat'
    //       }
    //       // } else {
    //       //   return `background:${this.colorList1[index]}`
    //       // }
    //       break
    //     case '运维':
    //       // if (index === 0) {
    //       return {
    //         background: 'url(' + imgUrl + ') center center no-repeat'
    //       }
    //       // } else {
    //       //   return `background:${this.colorList2[index]}`
    //       // }
    //       break
    //     case '配置':
    //       // if (index === 0) {
    //       return {
    //         background: 'url(' + imgUrl + ') center center no-repeat'
    //       }
    //       // } else if (index === 1) {
    //       //   return {
    //       //     background:
    //       //       'url(' + this.colorList3[index] + ') center center no-repeat'
    //       //   }
    //       // } else {
    //       //   return `background:${this.colorList3[index]}`
    //       // }
    //       break
    //     default:
    //       break
    //   }
    // },
    /**
     * 格式化树形结构数据   生成 vue-router 层级路由表
     */
    loadView(viewPath) {
      return () => require([`@/views/${viewPath}`])
    },
    filterRouter(data) {
      // 重新加载一次 VueRouter
      console.log('router~~~~~~~', router)
      console.log('data~~~~~~~', data)
      const childComponent = []
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((child) => {
            // 组装路由配置
            const childTemp = {
              name: child.name,
              path: child.path,
              meta: child.meta,
              component: (resolve) =>
                require([`@/views/${child.component}`], resolve)
            }
            childComponent.push(childTemp)
          })
          const temp = {
            name: item.name,
            path: item.path,
            meta: item.meta,
            component: (resolve) =>
              require([`@/views/${item.component}`], resolve),
            children: childComponent
          }
          router.addRoutes([temp])
          router.options.routes.push(temp)
        } else {
          const elseTemp = {
            name: item.name,
            path: item.path,
            meta: item.meta,
            component: (resolve) =>
              require([`@/views/${item.component}`], resolve)
          }
          router.addRoutes([elseTemp])
          router.options.routes.push(elseTemp)
        }
      })

      // 动态添加一个 404 页面
      router.addRoutes([
        {
          path: '*',
          component: () => import('@/views/404.vue')
        }
      ])
      console.log('router~~~~~~~last`````````````', router)
      store.dispatch('user/dynamicRouters', router.options.routes)
    },

    goContentList(name, item, index) {
      // store.dispatch('user/changeActiveIndex', item.appUrl)
      let Url = ''
      console.log('name', name)
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
              console.log('resRouter1', resRouter1)
              store.dispatch('user/changeInit', false)
              this.$router.push({ path: resRouter1[0].children[0].path })
            }
          })
          break
        case '运维':
          Local.set('tree_type', 2)
          getTypeTreeMenus(2).then((res2) => {
            if (res2.code === 0) {
              const resRouter2 = []
              res2.data.map((item) => {
                resRouter2.push(item)
              })
              console.log('resRouter2', resRouter2)
              store.dispatch('user/changeInit', false)
              store.dispatch('user/dynamicRouters', resRouter2)
              this.$router.push({ path: resRouter2[0].children[0].path })
            }
          })
          break
        case '配置':
          Local.set('tree_type', 3)
          getTypeTreeMenus(3).then((res3) => {
            if (res3.code === 0) {
              const resRouter3 = []
              res3.data.map((item) => {
                resRouter3.push(item)
              })
              console.log('resRouter3', resRouter3)
              store.dispatch('user/dynamicRouters', resRouter3)
              store.dispatch('user/changeInit', false)
              this.$router.push({ path: resRouter3[0].children[0].path })
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
