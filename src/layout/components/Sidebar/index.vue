<template>
  <div :class="{ 'has-logo': showLogo }">
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height: calc(100% - 62px);">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        ref="leftNavigation"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>

    <div class="bottom-logo"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    }
  },
  mounted() {
    this.select(this.$route.path);
  },
  methods: {
    select(index) {
      if (this.$route.path !== index) this.$router.push(index);
      if (
        this.$store.state.tabs.tabList.every(
          item => item.path !== this.$route.path
        )
      ) {
        this.$store.state.tabs.tabList.push(this.$route);
        // this.$store.commit("tabList", this.$store.state.tabs.tabList);
        console.log("~~~~~~~~~~~~~", this.$store.state);
      }
    }
  }
};
</script>
<style lang="scss" scoped>

.bottom-logo {
  position: absolute;
  height: 62px;
  width: 100%;
  bottom: 0;
  background: url("../../../assets/imgs/logoBottom.png") no-repeat;
  background-size: 100% 100%;
}
</style>
