<template>
  <div class="home-page-content">
    <Header v-if="!resThirdPartyLogin" class="wrapper-header header3" />
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
                  ? goContentList(item.isFullScreen, item.childList, child)
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
import {
  getTypeTreeMenus,
  getHomeResource,
  getHomeFunc
} from '@/api/method/home'

import { getMenuLists } from '@/api/method/user'

import store from '@/store/index'
import router from '../../../router/index'
import { Local, Session } from '@/utils/storage'
import Layout from '@/layout/index'

import { antiShake } from '@/utils/index.js'
// import { resetRouter, router } from '../../../router/index'

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
      resThirdPartyLogin: false,
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
    // windowWidth: {
    //   handler: function (val, oldVal) {
    //     const h = document.getElementsByTagName('HTML')[0]
    //     h.style.setProperty('--web-zoom', this.windowWidth / 1920)
    //     this.$forceUpdate()
    //   },
    //   immediate: true
    // }
  },
  created() {
    Local.set('permissionData', [])
    Local.set('permissionMenuId', '')
    Local.set('equipmentActiveName', '编码器')
    store.dispatch('user/changeThirdPartyLogin', false)
    this.routerLists = []

    // this.resThirdPartyLogin = Session.get('third_party_login')
    this.resThirdPartyLogin =
      Session.get('third_party_login') !== null &&
      Session.get('third_party_login')
        ? true
        : false
  },
  mounted() {
    this.initMenuLists()
    // this.windowWidth = document.documentElement.clientWidth
    // window.onresize = this.throttle(this.setScale, 500, 500)
    let timestamp = Local.get('expires_in')

    clearInterval(window.interval)

    window.interval = setInterval(() => {
      timestamp = timestamp - 1
      Local.set('expires_in', timestamp)
    }, 1000)
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
    // setScale() {
    //   // 以1920px为标准宽度
    //   this.windowWidth = document.documentElement.clientWidth
    // },
    getBackground(item) {
      let result = false
      let url = './' + item.icon + '.png'
      // console.log('url~~~~~~~~~~',url)
      // 获取所有图片地址
      const files = require.context('../../../assets/imgs/', false, /\.png$/)

      files.keys().forEach((item) => {
        if (item === url) {
          result = true
        }
      })
      //  console.log('result~~~~~~~~~~',result)
      return result
        ? 'url(' +
            require('../../../assets/imgs/' + item.icon + '.png') +
            ') center center no-repeat'
        : 'none'
    },

    routerChild(data) {
      let resRouterChildren = []
      let childTemp = {}
      data.forEach((item, i) => {
        // 组装路由配置
        childTemp = {
          name: item.name,
          path: item.path,
          id: item.id,
          meta: { icon: item.icon, title: item.name },
          component: item.component
        }
        if (item.childList) {
          const childArr = this.routerChild(item.childList)
          childTemp.children = childArr
        }
        resRouterChildren.push(childTemp)
      })
      return resRouterChildren
    },

    routerChildren(data, arr) {
      data.forEach((datas, index) => {
        arr.push({
          path: datas.path,
          name: datas.name,
          types: datas.types,
          hidden: datas.disabled === 1 ? true : false,
          component:
            datas.component === 'Layout'
              ? Layout
              : (resolve) => require([`@/views${datas.component}`], resolve),
          meta: {
            title: datas.name,
            icon: datas.icon
          },
          id: datas.id,
          // 子路由
          children: []
        })

        if (datas.childList) {
          const childArr = this.routerChildren(datas.childList, [])
          arr[index].children = childArr
        }
      })
      return arr
    },

    /**
     * 格式化树形结构数据   生成 vue-router 层级路由表
     */

    saveComponents(data, resName) {
      // resetRouter()
      const homeRouters = [
        {
          path: '/workTable',
          name: 'workTable',
          component: () => import('@/views/leftMenus/workTable/index'),
          meta: { title: '首页', icon: 'sy' }
        }
      ]

      if (data && data.length > 0) {
        let typeRouter = []
        let resData = []

        let params = {}
        let params1 = {}
        let params2 = {}

        data.forEach((item) => {
          params = {
            path: item.path,
            meta: { icon: item.icon, title: item.name },
            name: item.name,
            id: item.id,
            component: Layout,
            children: this.routerChildren(item.childList, [])
          }
          params1 = {
            path: item.path,
            meta: { icon: item.icon, title: item.name },
            name: item.name,
            id: item.id
          }
          params2 = {
            path: item.path,
            meta: { icon: item.icon, title: item.name },
            name: item.name,
            icon: item.icon,
            id: item.id,
            component: item.component,
            children: this.routerChild(item.childList)
          }
          typeRouter.push(params1)
          this.routerLists.push(params)
          resData.push(params2)
        })

        store.dispatch('user/dynamicRouters', [])

        store.dispatch('user/changeDynamicRouters', [])

        store.dispatch('user/dynamicRouters', resData)

        store.dispatch('user/changeDynamicRouters', resData)

        this.routerLists.forEach((item1) => {
          if (item1.name === resName) {
            store.dispatch('user/changeSidebarRouter', item1.children)
          }
        })

        store.dispatch('user/changeTypeRouter', [])

        store.dispatch('user/changeTypeRouter', homeRouters.concat(typeRouter))
      }
    },
    goContentList: antiShake(function (val, data, child) {
      // console.log('goContentList', val, data, child)
      Local.set('resRouterName', child.name)
      Local.set('isShowSideRouter', val)

      this.isGoContentListClicked = true

      // store.dispatch('user/changeInit', false)

      if (val === 0) {
        store.dispatch('user/changeRightWidth', true)
        store.dispatch('user/changeShowSidebar', true)
      } else {
        store.dispatch('user/changeRightWidth', false)
        store.dispatch('user/changeShowSidebar', false)
      }

      store.dispatch('user/changeActiveIndex', child.path)
      this.routerLists = []

      this.saveComponents(data, child.name)
      if (child.childList[0]) {
        getHomeFunc({
          menuId: child.childList[0] ? child.childList[0].id : ''
        }).then((res) => {
          if (res.data.code === 0) {
            Local.set('permissionData', res.data.data)
            Local.set(
              'permissionMenuId',
              child.childList[0] ? child.childList[0].id : ''
            )
            this.$router.push({ path: child.childList[0].path })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '用户无权限:' + child.name + '目录下的页面未授权，无法跳转'
        })
      }

      setTimeout(() => {
        this.isGoContentListClicked = false
      }, 5000)
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
    display: flex;
    // justify-content: space-between;
    justify-content: flex-start;
    flex-wrap: wrap;
    .container-middle-contnet {
      width: 45%;

      margin: 12px;
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
