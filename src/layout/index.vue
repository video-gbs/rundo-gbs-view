<template>
  <div class="app-wrapper">
    <Header class="wrapper-header" />
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar/>
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Header, Sidebar, AppMain,Navbar } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {
    Sidebar,
    AppMain,
    Header,
    Navbar
  },
  mixins: [ResizeMixin],
  created() {
    this.initTabList();
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    },

    // 当前所在模块
    menuModule() {
      return this.$store.state.menuModule;
    },
    tabList() {
      return this.$store.state.tabList;
    }
  },
  methods: {
    initTabList() {
      console.log(this.$route.path);
      // 获取匹配到的路由对象
      const firstRoute = this.$router.options.routes.filter(
        item => item.name === this.menuModule
      )[0];
      // 循环该路由对象的children
      const { redirect } = firstRoute;
      if (firstRoute && redirect) {
        const saveRoute = firstRoute.children.filter(
          item => item.path === redirect
        )[0];
        if (saveRoute) {
          this.tabList.push(saveRoute);
          this.$store.commit("tabList", this.tabList);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
@import "~@/styles/element-variables.scss";

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
  }
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
