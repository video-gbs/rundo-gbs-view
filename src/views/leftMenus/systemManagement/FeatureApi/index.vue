<template>
  <div class="main" v-if="isShow">
    <div class="panel-header-box">
      <div class="panel-header-box-border">功能接口管理</div>
    </div>
    <div class="main-content">
      <div class="featureApi_container">
        <leftTree
          ref="featureApiTree"
          class="featureApiTree"
          :treeData="treeData"
          :defaultPropsName="areaNames"
          @childClickHandle="childClickHandle"
        />
      </div>
      <div class="right-table p10" v-show="!isClickedResourceBtn">
        <FeatureApiTable
          ref="featureApiTable"
          :featureApiTableTreeData="treeData"
          @changeIsClickedResourceBtn="changeIsClickedResourceBtn"
        />
      </div>
      <div class="right-table p10" v-show="isClickedResourceBtn">
        <FeatureRrsourceTable
          ref="featureRrsourceTable"
          :funcId="funcId"
          @changeIsClickedResourceBtn="changeIsClickedResourceBtn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement/components/leftTree'
import FeatureApiTable from './components/FeatureApiTable.vue'
import FeatureRrsourceTable from './components/FeatureRrsourceTable.vue'
import { getMenuTree } from '@/api/method/menus'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { leftTree, FeatureApiTable, FeatureRrsourceTable },

  data() {
    return {
      areaNames: 'name',
      isShow: false,
      treeData: [],
      funcId: '',
      isClickedResourceBtn: false,
      defaultProps: {
        children: 'childList',
        label: 'name'
      }
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  watch: {
    funcId(newVal) {
      this.funcId = newVal
    }
  },
  methods: {
    handleClick(val, event) {},
    async init() {
      await getMenuTree()
        .then((res) => {
          if (res.data.code === 0) {
            setTimeout(() => {
              this.isShow = true
            }, 500)
            setTimeout(() => {
              this.$nextTick(() => {
                this.treeData = [res.data.data]
                this.$refs.featureApiTable.changeName(res.data.data)
                const resId = Local.get('featureApiId')
                  ? Local.get('featureApiId')
                  : res.data.data.id
                this.$refs.featureApiTable.getList(resId)
              })
            }, 500)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    changeIsClickedResourceBtn(val, id) {
      if (val === 1) {
        this.isClickedResourceBtn = true
        this.funcId = id
        this.$nextTick(() => {
          this.$refs.featureRrsourceTable.initFeatureResourceList(id)
        })
      } else {
        this.isClickedResourceBtn = false
        this.$nextTick(() => {
          this.$refs.featureApiTree.chooseId(Local.get('featureApiId'))
          this.init()
        })
      }
    },
    childClickHandle(data) {
      this.isClickedResourceBtn = false
      this.$refs.featureApiTable.saveId(data.id)

      Local.set('featureApiId', data.id)

      this.$refs.featureApiTable.getList(data.id)

      this.$refs.featureApiTable.changeName(data)
    }
  },
  destroyed() {
    Local.set('featureApiId', '')
  }
}
</script>

<style lang="scss" scoped>
::v-deep .featureApiTree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 没有展开且有子节点
::v-deep .featureApiTree .el-icon-caret-right:before {
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
  .featureApiTree
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
::v-deep .featureApiTree .el-tree-node__expand-icon.is-leaf::before {
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
    .featureApi_container {
      height: calc(100% - 40px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
      .featureApiTree {
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
