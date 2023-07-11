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
      <div class="container-middle" v-if="allDataLists.length > 0">
        <div
          class="container-middle-contnet"
          v-for="(item, index) in allDataLists"
          :key="index"
        >
          <LineFont
            class="line-font"
            :line-title="{
              title: item.name,
              notShowSmallTitle: false
            }"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
          <ul class="home-ul-top">
            <li
              v-for="(child, index1) in item.childList"
              :key="index1"
              class="top-li"
              @click="
                !isGoContentListClicked
                  ? goContentList(item.isFullScreen, child)
                  : ''
              "
            >
              <div
                v-cloak
                class="top-li-div"
                :style="{
                  background: getBackground(child)
                }"
              ></div>
              <span class="top-li-span">{{ child.name }}</span>
            </li>
          </ul>
        </div>
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
import Layout from '@/layout/index'

import { antiShake } from '@/utils/index.js'

export default {
  components: {
    LineFont,
    Header
  },
  data() {
    return {
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
      allDataLists: [],
      lineTitle: {
        title: '常用',
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

      // 路由
      routerLists: [],
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
            this.allDataLists = res.data.data
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

    routerChildren(data) {
      let resRouterChildren = []
      let childTemp = {}
      data.forEach((item) => {
        // 组装路由配置
        childTemp = {
          name: item.name,
          path: item.path,
          meta: { icon: item.icon, title: item.name },
          component: (resolve) => require([`@/views${item.component}`], resolve)
        }
        resRouterChildren.push(childTemp)
      })
      return resRouterChildren
    },

    /**
     * 格式化树形结构数据   生成 vue-router 层级路由表
     */

    async saveComponents(data) {
      if (data && data.length > 0) {
        // this.routerLists = []
        let typeRouter = []

        data.map((item) => {
          let params = {}
          let params1 = {}
          params = {
            path: item.path,
            meta: { icon: item.icon, title: item.name },
            name: item.name,
            component: Layout,
            children: this.routerChildren(item.childList)
          }
          params1 = {
            path: item.path,
            meta: { icon: item.icon, title: item.name },
            name: item.name
          }
          typeRouter.push(params1)
          this.routerLists.push(params)
        })

        await store.dispatch('user/dynamicRouters', this.routerLists)

        console.log(
          'this.routerLists~~~~~~~~~~~~~~~~~~',
          typeRouter,
          this.routerLists[0].children
        )

        await store.dispatch(
          'user/changeSidebarRouter',
          this.routerLists[0].children
        )

        await store.dispatch('user/changeTypeRouter', typeRouter)
      }
    },
    goContentList: antiShake(function (val, data) {
      console.log(111111, val, data)
      this.isGoContentListClicked = true

      store.dispatch('user/changeInit', false)

      if (val === 0) {
        console.log('显示侧边，顶部')
        store.dispatch('user/changeRightWidth', true)
        store.dispatch('user/changeShowSidebar', true)
      } else {
        console.log('不不不显示侧边，顶部')
        store.dispatch('user/changeRightWidth', false)
        store.dispatch('user/changeShowSidebar', false)
      }

      store.dispatch('user/changeActiveIndex', data.childList[0].path)

      this.saveComponents([data])

      Local.set('funcId', data.childList[0].id)
      this.$router.push({ path: data.childList[0].path })
      // switch (name) {
      //   case '应用':
      //     Local.set('tree_type', 1)

      //     console.log('this.appList', this.appList)

      //     store.dispatch('user/dynamicRouters', [])

      //     store.dispatch('user/dynamicRouters', this.appList)
      //     store.dispatch('user/changeInit', false)
      //     store.dispatch('user/changeRightWidth', false)
      //     store.dispatch('user/changeShowSidebar', false)

      //     this.saveComponents(1, this.appList)
      //     store.dispatch('user/changeTypeRouter', this.appTypeRouter)

      //     store.dispatch('user/changeActiveIndex', data.path)
      //     this.$router.push({ path: data.path })
      //     break
      //   case '运维':
      //     Local.set('tree_type', 3)
      //     getMenuLists({ levelNumStart: 1, levelNumEnd: 4 }).then((res2) => {
      //       if (res2.data.code === 0) {
      //         const resData = res2.data.data[1].childList

      //         store.dispatch('user/changeInit', false)

      //         store.dispatch('user/dynamicRouters', [])
      //         store.dispatch('user/dynamicRouters', resData)
      //         store.dispatch('user/changeRightWidth', true)
      //         store.dispatch('user/changeShowSidebar', true)

      //         this.saveComponents(3, resData)
      //         store.dispatch('user/changeTypeRouter', this.systemTypeRouter)

      //         this.$router.push({ path: resData[0].childList[0].path })

      //         Local.set('funcId', resData[0].childList[0].id)
      //       }
      //     })
      //     break
      //   case '配置':
      //     Local.set('tree_type', 2)
      //     getMenuLists({ levelNumStart: 1, levelNumEnd: 4 }).then((res3) => {
      //       if (res3.data.code === 0) {
      //         const resRouter3 = res3.data.data[2].childList

      //         store.dispatch('user/dynamicRouters', [])

      //         store.dispatch('user/dynamicRouters', resRouter3)
      //         store.dispatch('user/changeInit', false)
      //         store.dispatch('user/changeRightWidth', true)
      //         store.dispatch('user/changeShowSidebar', true)

      //         store.dispatch('user/changeActiveIndex', data.path)

      //         this.saveComponents(2, resRouter3, data.path)

      //         store.dispatch('user/changeTypeRouter', this.configTypeRouter)
      //       }
      //     })
      //     break
      //   default:
      //     break
      // }
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
    .container-middle-contnet {
      width: 50%;
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
