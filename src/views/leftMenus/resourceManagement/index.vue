<template>
  <div class="main">
    <div class="panel-header-box">
      <div class="panel-header-box-border">前端设备</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <leftTree
          :treeData="treeList"
          @childClickHandle="childClickHandle"
          :defaultPropsName="areaNames"
        />
      </div>
      <div
        class="p10"
        :class="!showSidebar ? 'right-table' : 'right-table-else'"
      >
        <el-tabs
          v-model="activeName"
          class="f1 f fd-c table-content"
          type="border-card"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="编码器"
            name="编码器"
            class="encoder-pane pane-content"
          >
            <Encoder
              ref="encoder"
              :detailsId="detailsId"
              :treeList="treeList"
            />
          </el-tab-pane>
          <el-tab-pane
            label="通道"
            name="通道"
            class="channel-pane pane-content"
          >
            <Channel
              ref="channel"
              :treeList="treeList"
              :detailsId="detailsId"
            />
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
import { getVideoAraeTree } from '@/api/method/role'
import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: { leftTree, Encoder, Channel },
  data() {
    return {
      activeName: '编码器',
      treeList: [],
      detailsId: '',
      areaNames: 'areaNames',
      changRight: ''
    }
  },
  created() {
    this.activeName = Local.get('equipmentActiveName')
      ? Local.get('equipmentActiveName')
      : '编码器'
    Local.remove('equipmentActiveName')
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapGetters(['rightWidth', 'showSidebar']),
    hasChangeRightWidth() {
      return this.rightWidth
    }
  },
  watch: {
    hasChangeRightWidth(newValue, oldValue) {
      this.changRight = newValue
    }
  },
  methods: {
    async init(id) {
      await getVideoAraeTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data
            this.detailsId = id ? id : res.data[0].id
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleClick(val, event) {
      this.activeName = val.label
    },
    childClickHandle(data) {
      this.detailsId = data.id
      this.$refs.encoder.getList(data.id)
      this.$refs.channel.getList(data.id)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  padding: 0;
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
  // top: 4px;
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
    }
    .right-table {
      width: 100%;
      height: calc(100% - 16px);
      margin: 6px 0 0 -10px;
      position: relative;
      .table-content {
        width: 100%;
        height: 100%;
        .pane-content {
          width: 100%;
          height: 100%;
        }
      }
    }
    .right-table-else {
      width: calc(100% - 340px);
      height: calc(100% - 16px);
      margin: 6px 0 0 -10px;
      position: relative;
      .table-content {
        width: 100%;
        height: 100%;
        .pane-content {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
</style>
