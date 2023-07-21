<template>
  <div class="main" v-if="!isUserAddShow && !isUserEditShow && isShow">
    <div class="panel-header-box">
      <div class="panel-header-box-border">用户管理</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <leftTree
          :treeData="treeData"
          @childClickHandle="childClickHandle"
          class="accountTree"
        />
      </div>
      <div class="right-table p10">
        <Encoder ref="encoder" @changeIsShow="changeIsShow" />
      </div>
    </div>
  </div>
  <UserAdd
    v-else-if="isUserAddShow"
    ref="userAdd"
    @changeIsShow="changeIsShow"
    @init="init"
  />
  <UserEdit
    v-else-if="isUserEditShow"
    ref="userEdit"
    @changeIsShow="changeIsShow"
    @init="init"
    :userEditRow="userEditRow"
  />
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement/components/leftTree'
import Encoder from './components/Encoder.vue'
import UserAdd from './components/userAdd.vue'
import UserEdit from './components/userEdit.vue'
import { getUnitList } from '@/api/method/unitManagement'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { leftTree, Encoder, UserAdd, UserEdit },

  data() {
    return {
      isUserAddShow: false,
      isUserEditShow: false,
      isShow: false,
      userEditRow: {},
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'sectionName'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    changeIsShow(val, name, row) {
      if (name === 'add') {
        this.isUserAddShow = val
      } else {
        this.isUserEditShow = val
        this.userEditRow = row
      }
    },
    handleClick(val, event) {},
    async init() {
      await getUnitList()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeData = [res.data.data]
            const resId = Local.get('newUserId')
              ? Local.get('newUserId')
              : res.data.data.id
            setTimeout(() => {
              this.isShow = true
            }, 100)
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.encoder.getList(resId)
              })
            }, 500)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    childClickHandle(data) {
      this.$refs.encoder.saveId(data.id)

      Local.set('newUserId', data.id)
      this.$refs.encoder.getList(data.id)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .accountTree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 没有展开且有子节点
::v-deep .accountTree .el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeOpen.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 已经展开且有子节点
::v-deep
  .accountTree
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeClose.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 没有子节点
::v-deep .accountTree .el-tree-node__expand-icon.is-leaf::before {
  display: none;
}
::v-deep .el-tabs__content {
  flex: 1;
}
::v-deep .el-tabs--border-card {
  box-shadow: none;
  border: 0;
}
.recycle-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 10;
}
::v-deep .el-tabs__item.is-active {
  border: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 20px 24px;
}
::v-deep .el-tabs--border-card {
  background: #f9f9f9;
  border-top: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border: 0 none;
  background: #ececec;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0 none;
  height: 36px;
  margin: 0 4px 0px 0;
  border-radius: 2px;
  background: #f6f6f6 !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  position: relative;
  top: 4px;
}
::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}
::v-deep .el-tabs__item {
  box-shadow: none !important;
}
.main {
  .panel-header-box {
    margin: 0;
    padding: 0 16px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .panel-header-box-border {
      border-top: 1px solid #eaeaea;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #011f53;
    }
  }
  .main-content {
    height: calc(100% - 60px);
    display: flex;
    justify-content: space-between;
    .securityArea_container {
      height: calc(100% - 40px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
      .accountTree {
        // height: 10;
        height: calc(100% - 70px) !important;
      }
    }

    .right-table {
      width: 100%;
      height: calc(100% - 16px);
      margin: 10px 0 0 -10px;
      position: relative;
    }
  }
}
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
</style>
