<template>
  <div class="app-header">
    <div class="app-header">
      <div class="app-header-left">
        <i class="logo mr8" />
        <h2>梧州问政后台系统</h2>
      </div>
      <div class="header-menu">
        <router-link
          v-for="(item, index) in routes"
          :key="index"
          :to="item.path"
          class="menu-item"
        >
          <!-- <i :class="item.meta.icon" /> -->
          <!-- <svg-icon :icon-class="item.meta.icon" /> -->
          <span>{{ item.meta.title }}</span>
        </router-link>
        <div class="menu-user">
          <el-dropdown class="" trigger="click">
            <div class="user-info">
              <svg-icon icon-class="user1" class="user" />
              <span class="fs14 mr10">{{
                userInfo.userName || "佚名用户"
              }}</span>
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item divided @click.native="logout">
                <span style="display: block">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-drawer
      title=""
      :visible.sync="showDrawer"
      :append-to-body="true"
      :modal="false"
      size="100%"
      direction="ttb"
      :with-header="true"
    >
      <div class="close-bar" @click="showDrawer = false">
        <svg-icon icon-class="put-away" class-name="put-away" />
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import Message from "../Message/index.vue";
import { Local } from "@/utils/storage";
// import NotTips from "@/components/NotTips";
import { logout } from "@/api/method/user";
export default {
  components: {
    // Message,
    // NotTips,
  },
  data() {
    return {
      showDrawer: false,
      messageData: {},
      messageCount: 0,
      lastCount: 0,
      show: false,
      userInfo: {},
    };
  },
  computed: {
    ...mapGetters(["user", "systemTitle"]),
    // avatar() {
    //   if (this.user.avatar) {
    //     return require(`@/assets/avatar/${this.user.avatar}`);
    //   } else {
    //     return require(`@/assets/avatar/default.jpg`);
    //   }
    // },
    /**
     * 工作平台和系统管理菜单
     */
    routes() {
      const routes = this.$router.options.routes.filter((route) => {
        return route.systemCode;
      });
      return routes;
    },
    systemName() {
      return this.$store.state.settings.systemName;
    },
    toGreet() {
      const now = new Date().getHours();
      return now < 12 ? "上午好" : now > 2 ? "下午好" : "中午好";
    },
  },
  created() {
    // if (Local.getToken()) {
    //   // this.initNotice();
    // }
    // this.$socket.create({
    //   callback: this.initNotice,
    // });
    // this.$socket.create(() => {
    //   if (Local.getToken()) {
    //     this.initNotice()
    //   }
    // })
    this.userInfo.userName =
      localStorage.getItem("rj_wzwz_userName") || "佚名用户";
    this.userInfo.userName = this.userInfo.userName
      .replace('"', "")
      .replace('"', "");
  },
  methods: {
    /**
     * 退出登录
     */
    logout() {
      // Local.
      logout({}, { Authorization: Local.getToken() })
        .then((res) => {
          // console.log(res, 11111)
          // if (res.code === 10000) {
          //   Local.setToken('')
          //   this.$router.push({ path: '/login' })
          // }
        })
        .catch(() => {})
        .finally(() => {
          Local.setToken("");
          Local.remove("rj_wzwz_token");
          Local.remove("rj_wzwz_deptType");
          Local.remove("rj_wzwz_userName");
          Local.remove("rj_wzwz_deptName");
          this.$router.push({ path: "/login" });
        });
    },
    setTheme() {
      this.$utils.setTheme("theme-blue");
    },
    reconent() {
      this.$socket.create();
    },
    initNotice() {
      this.$api.message.list().then((res) => {
        if (res.data.data) {
          this.messageData = {
            rows: res.data.data,
          };
          let count = this.messageData.rows.length;
          this.messageData.rows.forEach((item) => {
            if (item.isRead) {
              count--;
            }
          });
          this.messageCount = count;
          if (count > 0) {
            if (count > this.lastCount) {
              this.lastCount = count;
              this.show = true;
            }
          } else {
            this.show = false;
          }
        }
      });
    },
    toMessage() {
      this.showDrawer = true;
      this.show = false;
    },
    closeTips() {
      this.show = false;
    },
  },
};
</script>
<style lang="scss">
@import "~@/styles/element-variables.scss";
.app-header {
  height: inherit;
  width: 100%;
  color: #fff;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 0 2rem;
  align-items: center;
  justify-content: space-between;
  background-color: $bg-color;
  // box-shadow: 0px 3px 6px 1px rgba(51, 51, 51, 0.16);
  background-image: url("../../../assets/imgs/top-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  .app-header-left {
    position: relative;

    .logo {
      position: absolute;
      top: 10px;
      width: 1.75rem;
      height: 1.75rem;
      background-image: url("~@/assets/imgs/logo.png");
      background-size: cover;
    }
    h2 {
      font-size: 18px;
      font-weight: bold;
      color: $font-color;
      margin-left: 2rem;
    }
  }
  .header-menu {
    display: flex;
    position: relative;
    .menu-item {
      margin: none;
      font-weight: bold;
      font-size: 1rem;
      display: flex;
      // margin-right: 3rem;
      cursor: pointer;
      i {
        font-size: 1.5rem;
        margin-right: 10px;
      }
      .system-svg-icon {
        height: 28px;
        width: 28px;
        margin-right: 5px;
      }
      path {
        fill: #fff !important;
      }
    }
    .is-active {
      background-color: #0079e8;
    }
    .menu-user {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .user-info {
      display: flex;
      align-items: center;
      font-size: 0.5rem;
      margin-left: 20px;
      position: relative;
      .user {
        width: 2rem;
        height: 2rem;
        margin-right: 1rem;
        position: absolute;
        top: -0.75rem;
        left: -2.5rem;
      }
      span {
        color: $font-color;
      }

      .el-avatar {
        margin-right: 10px;
      }
      i {
        font-size: 0.625rem;
        color: $font-color;
      }
    }
  }

  .el-drawer__close-btn {
    position: absolute;
    font-size: 32px;
    color: #fff;
    top: 74px;
    right: 34px;
    z-index: 1;
    cursor: pointer;
    &:hover i {
      font-weight: bolder;
    }
  }
}
.user-info-container {
  // width: 200px;
  // height: 250px;
  .logout {
    cursor: pointer;
  }
}
.close-bar {
  width: 100%;
  // height: 40px;
  padding: 9px 0;
  left: 0;
  top: 60px;
  background: #fff;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  cursor: pointer;
  .put-away {
    font-size: 32px;
  }
}
</style>
