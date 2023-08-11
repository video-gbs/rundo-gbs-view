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
          :default-active="activeIndex"
          class="top-menus"
        >
          <template v-for="(item, index) in typeRouter">
            <el-menu-item
              :index="item.path"
              :key="index"
              class="top-menus-item"
            >
              <div class="top-menus-div" @click="clickRouter(item)">
                <span slot="title" class="top-menus-span"
                  ><svg-icon
                    class="top-menu-svg"
                    :icon-class="item.meta.icon"
                  />{{ item.meta.title }}</span
                >
              </div>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div class="header-menu">
        <div class="menu-user">
          <div class="user-menu">
            <svg-icon icon-class="user3" class="user" />
            <span class="fs14 mr10">系统操作指南</span>
            <span class="user-line" />
          </div>
          <el-dropdown class trigger="click">
            <div class="user-info">
              <svg-icon icon-class="user2" class="user" />
              <span class="fs14 mr10">
                {{ userName || '佚名用户' }}
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
import { Local, Session } from '@/utils/storage'
import { logout, newLogout } from '@/api/method/user'
import store from '@/store/index'

import { getHomeFunc } from '@/api/method/home'

// import { resetRouter } from '@/router/index'
export default {
  props: {
    isShowTopMenus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: store.state.user.activeIndex,
      showDrawer: false,
      userInfo: {},
      sideBarRouterList: [],
      sideBarRouterList1: [],
      sideBarRouterList2: [],
      sideBarRouterList3: [],
      userName: ''
    }
  },
  computed: {
    ...mapGetters(['routerLists', 'typeRouter']),
    changeTypeRouter() {
      return this.typeRouter
    },
    changeRouterLists() {
      return this.routerLists
    }
  },
  watch: {
    changeTypeRouter(newValue, oldValue) {},
    changeRouterLists(newValue, oldValue) {}
  },
  created() {
    // this.getHomeUser()
  },
  mounted() {
    this.userName = Local.get('rj_userName') || '佚名用户'
    // this.userName = this.userName.replace('"', '').replace('"', '')
  },
  methods: {
    async getHomeUser() {
      await getHomeUser()
        .then((res) => {
          if (res.data.code === 0) {
            this.userName = res.data.data.username
              .replace('"', '')
              .replace('"', '')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 退出登录
     */
    logout() {
      newLogout()
        .then((res) => {})
        .catch(() => {})
        .finally(() => {
          Local.setToken('')
          Session.remove('access_token')
          Local.remove('rj_deptType')
          clearInterval(window.interval)
          this.$router.push({ path: '/login' })
        })
    },
    clickRouter(data) {
      Local.set('resRouterName', data.name)
      const resArray =
        this.routerLists && this.routerLists.length > 0
          ? this.routerLists
          : JSON.parse(Local.get('dynamicRouters'))
      if (data.path === '/workTable') {
        this.$router.push({ path: data.path })
        // resetRouter()
        store.dispatch('user/changeRightWidth', false)
        store.dispatch('user/changeShowSidebar', false)
      } else {
        // store.dispatch('user/changeShowSidebar', true)
      }

      resArray.map((item) => {
        if (item.name === data.name) {
          store.dispatch('user/changeSidebarRouter', item.children)
          store.dispatch('user/changeActiveIndex', item.path)
          getHomeFunc({ menuId: item.children[0].id }).then((res) => {
            if (res.data.code === 0) {
              console.log('data~~~~~~', data, resArray)
              Local.set('permissionData', res.data.data)
              Local.set('permissionMenuId', item.children[0].id)

              this.$router.push({ path: item.children[0].path })
            }
          })
        }
      })
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
  z-index: 999;
  padding: 0 10px;
  align-items: center;
  opacity: 1;
  justify-content: space-between;
  background-color: rgba(0, 49, 116, 1);
  box-shadow: 0px 3px 6px 1px rgba(51, 51, 51, 0.16);
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
  .logout {
    cursor: pointer;
  }
}
.close-bar {
  width: 100%;
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
}
</style>
