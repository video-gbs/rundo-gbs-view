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
        <Navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Header, Sidebar, AppMain, Navbar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import store from "@/store/index";

export default {
  name: "Layout",
  components: {
    Sidebar,
    AppMain,
    Header,
    Navbar,
    TagsView,
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
        mobile: this.device === "mobile",
      };
    },

    // 当前所在模块
    menuModule() {
      return this.$store.state.tabs.menuModule;
    },
    tabList() {
      return this.$store.state.tabs.tabList;
    },
  },
  methods: {
    initTabList() {
      this.tabList.push(this.$route.path);
    },
  },
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
// 滚动条
.main-container::-webkit-scrollbar {
  width: 6px;
  height: 1px;
}
.main-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #e5e5e5;
}
.main-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
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
