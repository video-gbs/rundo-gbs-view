<template>
  <section class="app-main f1 fd-c ai-s" v-if="changeRouter">
    <div style="height: 100%" class="app-main-c f1 f">
      <transition name="fade-transform1" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
      </transition>
      <transition name="fade-transform2" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
      </transition>
    </div>
    <!-- <h2 class="company-title f jc-c ai-c">©2022 润建股份有限公司 版权所有</h2> -->
  </section>
  <section class="app-main-else f1 fd-c ai-s" style="height: 100%" v-else>
    <div style="height: 100%" class="app-main-c f1 f">
      <transition name="fade-transform1" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
      </transition>
      <transition name="fade-transform2" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      changeRouter: true
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.path === '/workTable') {
          this.changeRouter = false
        } else {
          this.changeRouter = true
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 136px); */
  height: calc(100%);
  width: 100%;
  position: relative;
  overflow: auto;
  overflow-x: hidden;
  padding: 0;
  background-color: #ececec;
  > div {
    width: 100%;
  }
}
.app-main-c {
  > div {
    // margin: 20px;
    width: 100%;
  }
}
.company-title {
  /* text-align: center;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #8b8b8b; */

  position: absolute;
  text-align: center;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #8b8b8b;
  bottom: 0;
  left: 0;
  width: 100%;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

.el-scrollbar {
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}

/*滚动条样式*/
.app-main::-webkit-scrollbar {
  width: 6px;
}
.app-main::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.app-main::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
