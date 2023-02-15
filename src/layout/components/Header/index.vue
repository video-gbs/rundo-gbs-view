<template>
  <div class="app-header">
    <div class="app-header">
      <div class="app-header-left">
        <div>
          <i class="logo mr8" />
          <h2>视频联网平台</h2>
        </div>
      </div>
      <div class="top-menus-content" v-if="isShowTopMenus">
        <el-menu
          mode="horizontal"
          text-color="#000000"
          active-text-color="#3989fa"
          :default-active="toIndex"
          @select="handleSelect"
          class="top-menus"
        >
          <el-menu-item
            v-for="(item, index) in itemList"
            :index="item.path"
            :key="index"
            class="top-menus-item"
          >
            <!-- <router-link active-class="active" :to="item.path"> -->
            <div class="top-menus-div" @click="clickRouter(item)">
              <span slot="title" class="top-menus-span"
                ><svg-icon class="top-menu-svg" icon-class="zhanghao" />{{
                  item.title
                }}</span
              >
            </div>
            <!-- </router-link> -->
          </el-menu-item>
        </el-menu>
      </div>
      <div class="header-menu">
        <div class="menu-user">
          <div class="user-menu">
            <svg-icon icon-class="user3" class="user" />
            <span class="fs14 mr10">系统操作指南</span>
            <span class="user-line" />
            <!-- <el-dropdown class trigger="click">
              <div class="user-info">
                <svg-icon icon-class="management" class="management" />

                <span class="user-line" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided @click.native="logout">
                  <span style="display: block"
                    ><svg-icon
                      icon-class="peizhi"
                      class="management1"
                    />配置管理</span
                  >
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">
                  <span style="display: block"
                    ><svg-icon
                      icon-class="yunwei"
                      class="management1"
                    />运维管理</span
                  >
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">
                  <span style="display: block"
                    ><svg-icon
                      icon-class="zhinan"
                      class="management1"
                    />系统操作指南</span
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
          <el-dropdown class trigger="click">
            <div class="user-info">
              <svg-icon icon-class="user2" class="user" />
              <span class="fs14 mr10">
                {{ userInfo.userName || '佚名用户' }}
              </span>
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
      title
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
import { mapGetters } from 'vuex'
// import Message from "../Message/index.vue";
import { Local } from '@/utils/storage'
// import NotTips from "@/components/NotTips";
import { logout } from '@/api/method/user'
export default {
  components: {
    // Message,
    // NotTips,
  },
  props: {
    isShowTopMenus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDrawer: false,
      messageData: {},
      messageCount: 0,
      lastCount: 0,
      show: false,
      userInfo: {},
      itemList: [
        { path: '/workTable', title: '首页', type: 1 },
        { path: '/test1', title: '应用1', type: 2 },
        { path: '/test2', title: '菜单1', type: 3 },
        { path: '/test3', title: '运维1', type: 1 },
        { path: '/permission', title: '应用2', type: 2 },
        { path: '/permission', title: '菜单2', type: 3 }
      ]
    }
  },
  computed: {
    ...mapGetters(['routerLists']),

    toIndex() {
      // 根据路径绑定到对应的一级菜单，防止页面刷新重新跳回第一个
      return '/' + this.$route.path.split('/')[1]
    }
  },
  created() {
    this.userInfo.userName = localStorage.getItem('rj_userName') || '佚名用户'
    this.userInfo.userName = this.userInfo.userName
      .replace('"', '')
      .replace('"', '')
  },
  methods: {
    /**
     * 退出登录
     */
    logout() {
      logout()
        .then((res) => {})
        .catch(() => {})
        .finally(() => {
          Local.setToken('')
          Local.remove('rj_token')
          Local.remove('rj_deptType')
          Local.remove('rj_userName')
          // Local.remove('rj__deptName')
          this.$router.push({ path: '/login' })
        })
    },
    clickRouter(item) {
      if (item.type === 1) {
        this.$emit('changeSidebarHiddenStatus', false)
        this.$router.push({ path: item.path })
      } else {
        this.$emit('changeSidebarHiddenStatus', true)
      }
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/element-variables.scss';
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
  opacity: 1;
  justify-content: space-between;
  background-color: rgba(0, 49, 116, 1);
  // background: rgba(0, 75, 173, 1);
  box-shadow: 0px 3px 6px 1px rgba(51, 51, 51, 0.16);
  // box-shadow: 0px 3px 6px 1px rgba(51, 51, 51, 0.16);
  background-image: url('../../../assets/imgs/top-bg.png');
  background-repeat: no-repeat;
  background-size: cover;

  .top-menus-content {
    position: absolute;
    left: 260px;
    .top-menus {
      background-color: transparent;
      height: 60px;
      border: 0 none;
      .top-menus-item {
        background-color: transparent;
        border: 0 none !important;
        &::after {
          display: none;
        }
        &.is-active {
          background-color: transparent !important;
          border: 0 none !important;
          .top-menus-span {
            background: linear-gradient(
              180deg,
              rgba(66, 148, 255, 0.5) 0%,
              rgba(2, 112, 255, 0.03) 100%
            );
            box-shadow: inset 0px 0px 12px 1px rgba(255, 255, 255, 0.16);
            border-radius: 15px 15px 15px 15px;
          }
        }
        .top-menus-div {
          height: 21px;

          .top-menu-svg {
            widows: 1rem;
            height: 1rem;
            position: relative;
            top: 0px;
            left: -8px;
          }
          .top-menus-span {
            font-size: 16px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
            display: inline;
            padding: 3px 15px;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .app-header-left {
    position: relative;

    .logo {
      position: absolute;
      top: 10px;
      width: 1.75rem;
      height: 1.75rem;
      background-image: url('~@/assets/imgs/topLogo.png');
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
    .user-menu {
      display: flex;
      align-items: center;
      font-size: 0.5rem;
      margin-right: 40px;
      position: relative;

      .user {
        width: 1rem;
        height: 1rem;
        margin-right: 1rem;
        position: absolute;
        top: 1px;
        left: -1.5rem;
      }
      .user-line {
        display: inline-block;
        width: 1px;
        height: 16px;
        background-color: #fff;
        margin-left: 10px;
      }
      span {
        color: $font-color;
        font-size: 16px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: 400;
      }

      .el-avatar {
        margin-right: 10px;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      font-size: 0.5rem;
      margin-left: 20px;
      position: relative;
      .management {
        width: 1rem;
        height: 1rem;
        margin-right: 1rem;
        position: absolute;
        top: 0;
        left: -1.5rem;
      }
      .user {
        width: 2rem;
        height: 2rem;
        margin-right: 1rem;
        position: absolute;
        top: -0.5rem;
        left: -2.5rem;
      }
      span {
        color: $font-color;
        font-size: 16px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
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
.management1 {
  width: 1rem;
  height: 1rem;
  margin-right: 1rem;
  // position: absolute;
  // top: 0;
  // left: -1.5rem;
}
</style>
