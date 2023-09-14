<template>
  <section class="app-main f1 fd-c ai-s">
    <div style="height: 100%" class="app-main-c f1 f">
      <transition name="fade-transform1" mode="out-in">
        <!-- <keep-alive> -->
        <router-view v-if="$router.path" :key="$router.path" />
        <!-- </keep-alive> -->
      </transition>
      <!-- <transition name="fade-transform2" mode="out-in">
        <router-view v-if="!$route.path" :key="key" />
      </transition> -->
    </div>
    <h2 v-if="showSidebar" class="company-title f jc-c ai-c">
      ©2023 润建股份有限公司 版权所有
    </h2>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
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
        console.log(val, 999)
        if (val.path === '/workTable') {
          this.changeRouter = false
        } else {
          this.changeRouter = true
        }
      },
      deep: true
    },
    changeShowSidebar(newValue, oldValue) {}
  },
  computed: {
    ...mapGetters(['showSidebar']),
    changeShowSidebar() {
      return this.showSidebar
    },
    key() {
      return this.$route.path
    }
  },
  created() {
    console.log(this.$route, '~~~~~~~~~~~~~~~~')
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100% - 56px);
  width: 100%;
  position: relative;
  overflow: hidden;
  overflow-x: hidden;
  padding: 0;
  background-color: #ececec;
  > div {
    width: 100%;
  }
}
.app-main-c {
  > div {
    width: 100%;
  }
}
.company-title {
  position: absolute;
  text-align: center;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #8b8b8b;
  bottom: -5px;
  left: 0;
  width: 100%;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  padding-right: 0 !important;
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
