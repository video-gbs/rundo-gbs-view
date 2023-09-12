<template>
  <!-- <div class="app-wrapper" v-if="nowRouter[0].name === 'workTable'">
    <Header
      v-if="!resThirdPartyLogin"
      class="wrapper-header header1"
      :isShowTopMenus="isShowTopMenus"
    />
    <div class="main-container f fd-c ai-s">
      <app-main />
    </div>
  </div> -->

  <div class="app-wrapper" v-if="!resThirdPartyLogin">
    <Header
      v-if="!resThirdPartyLogin"
      class="wrapper-header header2"
      :isShowTopMenus="!isShowTopMenus"
      @changeSidebarLists="changeSidebarLists"
    />
    <sidebar
      class="sidebar-container"
      v-if="showSidebar && !resThirdPartyLogin"
      :sidebarLists="sidebarLists"
    />
    <div
      :class="[!showSidebar ? 'main-container' : 'main-container-else']"
      class="f fd-c ai-s"
    >
      <Breadcrumb v-if="showSidebar" />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Header, Sidebar, AppMain, Navbar } from './components'
import Breadcrumb from '../components/Breadcrumb'
import store from '@/store/index'
import { mapGetters } from 'vuex'
import { Local, Session } from '@/utils/storage'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain,
    Header,
    Navbar,
    Breadcrumb
  },
  data() {
    return {
      nowWidth: '',
      baseW: '',
      nowRouter: [],
      isShowTopMenus: false,
      sidebarClass: true,
      sidebarLists: [],
      windowWidth: null,
      resThirdPartyLogin: false
    }
  },
  computed: {
    ...mapGetters(['showSidebar']),
    changeShowSidebar() {
      return this.showSidebar
    },
    // changeThirdPartyLogin() {
    //   return this.thirdPartyLogin1
    // },
    sidebar() {
      return store.state.app.sidebar
    },
    device() {
      return store.state.app.device
    },
    fixedHeader() {
      return store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    // 当前所在模块
    menuModule() {
      return store.state.tabs.menuModule
    },
    tabList() {
      return store.state.tabs.tabList
    }
  },
  watch: {
    changeShowSidebar() {}
    // changeThirdPartyLogin(oldValue, newValue) {
    //   console.log('this.thirdPartyLogin~~~~~~111', oldValue, newValue)
    // }
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
    // this.nowRouter = this.$route.matched.filter((item) => item.name)
    // console.log(this.nowRouter, this.nowRouter[0].name)

    // this.setScale()
    this.initTabList()
  },
  mounted() {
    // this.windowWidth = document.documentElement.clientWidth
    // window.onresize = this.throttle(this.setScale, 500, 500)

    console.log(
      'this.thirdPartyLogin1this.thirdPartyLogin1',
      Session.get('third_party_login')
    )
    // this.$nextTick(() => {
    this.resThirdPartyLogin =
      Session.get('third_party_login') !== null &&
      Session.get('third_party_login')
        ? true
        : false
    //   this.$forceUpdate()
    // })
  },
  methods: {
    // changeSidebarHiddenStatus(val) {
    //   this.showSidebar = val
    //   this.sidebarClass = val
    // },
    changeSidebarLists(val) {
      this.sidebarLists = val
    },

    initTabList() {
      this.tabList.push(this.$route.path)
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
    }
    // setScale() {
    //   // 以1920px为标准宽度
    //   this.windowWidth = document.documentElement.clientWidth
    // }
  }
}
</script>

<style lang="scss" scoped>
// @import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
@import '~@/styles/element-variables.scss';
::v-deep .sidebar-container {
  box-shadow: 2px 0px 6px 1px rgba(51, 51, 51, 0.16);
  .el-scrollbar__wrap {
    margin-right: 0px !important;
    overflow: hidden;
  }
}
.app-wrapper {
  // @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .wrapper-header {
    height: 3.5rem;
  }
  .sidebar-container {
    top: 3.5rem;
    height: calc(100% - 3.5rem);
    background-color: #fff;
    position: relative;
  }
  .main-container {
    height: calc(100% - 56px);
    width: 100%;
    // padding-top: 3.5rem;
    overflow: auto;
    background-color: rgba(242, 242, 242, 1);
    > div {
      width: 100%;
    }
  }
  .main-container-else {
    height: calc(100% - 56px);
    // padding-top: 3.5rem;
    width: calc(100% - 220px);
    margin-left: 220px;
    overflow: auto;
    background-color: rgba(242, 242, 242, 1);
    // background-image: url('../assets/imgs/homebg.png');
    // background-repeat: no-repeat;
    // background-size: cover;
    // background-attachment: fixed;
    > div {
      width: 100%;
    }
  }
}

/*滚动条样式*/
.main-container-else::-webkit-scrollbar {
  width: 6px;
}
.main-container-else::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.main-container-else::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

/*滚动条样式*/
.main-container::-webkit-scrollbar {
  width: 6px;
}
.main-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.main-container::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
