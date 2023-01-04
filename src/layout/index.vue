<template>
  <div class="app-wrapper" v-if="showSidebar">
    <Header class="wrapper-header" />
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container f fd-c ai-s">
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
      </div>
      <app-main />
    </div>
  </div>
  <div class="app-wrapper" v-else>
    <Header class="wrapper-header" />
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="main-container-else">
      <!-- <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
      </div> -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Header, Sidebar, AppMain, Navbar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import store from '@/store/index'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain,
    Header,
    Navbar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      nowWidth: '',
      baseW: '',
      showSidebar: true
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.path === '/workTable') {
          this.showSidebar = false
        } else {
          this.showSidebar = true
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
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
      return this.$store.state.tabs.menuModule
    },
    tabList() {
      return this.$store.state.tabs.tabList
    }
  },
  created() {
    const nowRouter = this.$route.matched.filter((item) => item.name)

    if (nowRouter[0].path === '/workTable') {
      this.showSidebar = false
    } else {
      this.showSidebar = true
    }
    this.setScale()
    this.initTabList()
  },
  mounted() {
    window.onresize = this.throttle(this.setScale, 500, 500)
  },
  methods: {
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
    },
    setScale() {
      // 以1920px为标准宽度
      const baseW = this.nowWidth || 1920
      const w = document.body.clientWidth
      // this.nowWidth = w
      // this.baseW = w

      const h = document.getElementsByTagName('HTML')[0]
      this.nowWidth = 1920 / (w / baseW)
      h.style.setProperty('--web-zoom', w / baseW)
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
@import '~@/styles/element-variables.scss';

.app-wrapper {
  @include clearfix;
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
    background-color: $bg-color1;
    position: relative;
  }
  .main-container {
    height: 100%;
    padding-top: 3.5rem;
    overflow: auto;
    background-color: rgba(242, 242, 242, 1);
    > div {
      width: 100%;
    }
  }
  .main-container-else {
    height: 100%;
    padding-top: 3.5rem;
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
