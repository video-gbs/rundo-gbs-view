<template>
  <div class="main">
    <div class="panel-header-box">
      <div>前端设备</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <leftTree />
      </div>
      <div class="right-table p10">
        <el-tabs
          v-model="activeName"
          class="f1 f fd-c"
          type="border-card"
          @tab-click="handleClick"
        >
          <el-tab-pane label="编码器" name="编码器">
            <Encoder />
          </el-tab-pane>
          <el-tab-pane label="通道" name="通道">
            <Channel />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import Encoder from './components/Encoder.vue'
import Channel from './components/Channel.vue'
export default {
  name: '',
  components: { leftTree, Encoder, Channel },
  data() {
    return {
      activeName: '编码器'
    }
  },
  mounted() {},
  methods: {
    handleClick(val, event) {}
  }
}
</script>

<style lang="scss" scoped>
/*表格表头全选*/
// ::v-deep .disabledSelection .cell .el-checkbox__inner{
//   margin-left: -30px;
//   position:relative;
// }
// ::v-deep .disabledSelection .cell:before{
//   content:"序号";
//   position:absolute;
//   right:11px;
// }
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
  margin: 0 4px 4px 0;
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
    padding: 0 20px;
    border: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .main-content {
    height: calc(100% - 0px);
    display: flex;
    justify-content: space-between;
    .securityArea_container {
      height: calc(100% - 40px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
      .btn-lists {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0 10px;
        .svg-btn {
          position: relative;
          top: 1px;
          left: -4px;
        }
      }
    }
    .right-table {
      width: calc(100% - 40px);
      margin: 6px 0 0 -10px;
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
