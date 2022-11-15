<template>
  <section class="app-main">
    <el-scrollbar
      style="height: 100%;"
    >
      <transition name="fade-transform1" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
      </transition>
      <transition name="fade-transform2" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
      </transition>
    </el-scrollbar>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
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
</style>
