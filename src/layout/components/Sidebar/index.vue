<template>
  <div :class="{ 'has-logo': showLogo }">
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      style="height: calc(100% - 62px)"
    >
      <el-menu
        ref="toptNavigation"
        router
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in sidebarRouter"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          class="left-menus"
        />
      </el-menu>
    </el-scrollbar>

    <div class="bottom-logo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  props: {
    sidebarLists: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      myRouter: []
    }
  },
  computed: {
    ...mapGetters(['sidebarRouter']),
    changeSidebarRouter() {
      return this.sidebarRouter
    },
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    }
  },
  watch: {
    changeSidebarRouter(newValue, oldValue) {}
  },

  mounted() {
    this.select(this.$route.path)
    this.myRouter = Object.assign([], this.sidebarRouter)
    const ut = localStorage.getItem('rj_deptType') || 9999
    this.setHide(this.myRouter, ut * 1)
  },
  methods: {
    setHide(v, ut) {
      v.forEach((i) => {
        if (i.author !== null && i.author !== undefined) {
          this.$set(i, 'authorHidden', false)
          !i.author.includes(ut) && this.$set(i, 'authorHidden', true)
        }
        if (i.children && i.children.length) {
          this.setHide(i.children, ut)
        }
      })
    },
    select(index) {
      if (this.$route.path !== index) this.$router.push(index)
      if (
        this.$store.state.tabs.tabList.every(
          (item) => item.path !== this.$route.path
        )
      ) {
        this.$store.state.tabs.tabList.push(this.$route)
        // this.$store.commit("tabList", this.$store.state.tabs.tabList);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .left-menus {
  .el-menu-item {
    > span {
      margin-left: 30px;
    }
  }
}
.bottom-logo {
  position: absolute;
  height: 62px;
  width: 100%;
  bottom: 0;
  background: url('../../../assets/imgs/logoBottom.png') no-repeat;
  background-size: 100% 100%;
}
</style>
