<template>
  <div class="main" v-if="!isRegistrationListShow && !isEditEquipment">
    <div class="panel-header-box">
      <div class="panel-header-box-border">前端设备</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button type="primary" @click="dialogShow">
            <svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span>
          </el-button>
          <el-button @click="dialogMoveShow">
            <svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">移动</span>
          </el-button>
          <div v-if="isClickTreeSort" @click="treeSort(1)" class="sort_div">
            <svg-icon class="svg-btn" icon-class="sort-b" />
            <span class="btn-span">排序</span>
          </div>
          <div v-else @click="treeSort(2)" class="clicked-button sort_div">
            <svg-icon class="svg-btn" icon-class="sort" />
            <span class="btn-span">排序</span>
          </div>
          <el-button @click="deleteAccount($event)">
            <svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">删除</span>
          </el-button>
        </div>
        <leftTree
          ref="deviceTree"
          class="equipmentTree"
          :treeData="treeList"
          :isClickTreeSort="isClickTreeSort"
          :defaultPropsName="areaNames"
          @childClickHandle="childClickHandle"
          @changeSort="changeSort"
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
              :detailsId="deviceDetailsId"
              :treeList="treeList"
              @changeIsShow="changeIsShow"
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
              :detailsId="channelDetailsId"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      v-if="editShow"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="600px"
      :before-close="handleClose"
    >
      <div slot="title" class="dialog-title">
        <LineFont
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div>
        <el-form
          ref="accountForm"
          class="params-form"
          label-position="right"
          label-width="auto"
          :model="dialog.params"
          :rules="dialogRules"
          @keyup.enter="submit('accountForm')"
        >
          <el-form-item label="父节点名称" prop="resourcePid">
            <el-select
              ref="selectTree"
              v-model="dialog.params.resourcePid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 436px"
              class="selectTree"
            >
              <el-option :value="dialog.params.resourcePid">
                <el-tree
                  ref="dialogTree"
                  class="unit-tree"
                  :data="treeList"
                  node-key="id"
                  :props="defaultProps"
                  :default-expanded-keys="Ids"
                  highlight-current
                  :expand-on-click-node="false"
                  @node-click="nodeClickHandle"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道名称" prop="name">
            <el-input
              v-model="dialog.params.name"
              style="width: 436px"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="isClick"
          @click="submit('accountForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <moveTree
      ref="moveTree"
      :treeData="treeList"
      :fatherId="fatherId"
      :activeName="activeName"
      @init="init"
    />
  </div>

  <RegistrationList
    v-else-if="isRegistrationListShow"
    ref="registrationList"
    @changeIsShow="changeIsShow"
  />
  <EditEquipment
    v-else
    ref="editEquipment"
    :editEquipmentRow="editEquipmentRow"
    @changeIsShow="changeIsShow"
  />
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import Encoder from './components/Encoder.vue'
import Channel from './components/Channel.vue'
import LineFont from '@/components/LineFont'
import moveTree from './components/MoveTree'
import RegistrationList from './components/RegistrationList'
import EditEquipment from './components/EditEquipment'

import {
  deviceVideoAreaList,
  videoAreaAdd,
  videoAreaEdit,
  videoAreaSort,
  videoAreaDelete
} from '@/api/method/encoder'
import { channelVideoAreaList } from '@/api/method/channel'

import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: {
    leftTree,
    Encoder,
    Channel,
    LineFont,
    RegistrationList,
    EditEquipment,
    moveTree
  },
  data() {
    return {
      isRegistrationListShow: false,
      isEditEquipment: false,
      editEquipmentRow: {},
      activeName: '编码器',
      treeList: [],

      resTree1: {},
      resTree2: {},
      channelDetailsId: '',
      deviceDetailsId: '',
      areaNames: 'resourceName',
      changRight: '',
      isShow: false,
      isClickTreeSort: true,
      lineTitle: {
        title: '新建资源',
        notShowSmallTitle: false
      },
      textStyle: {
        fontSize: '18px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#333333'
      },
      lineBlueStyle: {
        background: 'rgba(30, 86, 160, 1)',
        width: '3px',
        height: '18px'
      },
      editShow: false,
      dialog: {
        show: false,
        title: '新建安防通道资源',
        params: {
          resourcePid: '',
          name: ''
        }
      },
      dialogRules: {
        name: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'blur'
          }
        ],
        resourcePid: {
          required: true,
          message: '此为必填项。',
          trigger: 'change'
        }
      },
      defaultProps: {
        children: 'childList',
        label: 'resourceName'
      },
      Id: '',
      fatherId: '',
      isClick: false
    }
  },
  created() {
    this.activeName = Local.get('equipmentActiveName')
      ? Local.get('equipmentActiveName')
      : '编码器'
    Local.remove('equipmentActiveName')

    this.init('编码器')
  },
  mounted() {},
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
    async init(name) {
      this.resTree1 = await channelVideoAreaList()
      this.resTree2 = await deviceVideoAreaList()

      this.deviceDetailsId = this.resTree2.data.data.id
      this.channelDetailsId = this.resTree1.data.data.id
      if (this.activeName !== '编码器') {
        this.treeList = [this.resTree1.data.data]
        this.$refs.deviceTree.chooseId(this.channelDetailsId)
        this.fatherId = this.resTree1.data.data.id
      } else {
        this.treeList = [this.resTree2.data.data]
        this.$refs.deviceTree.chooseId(this.deviceDetailsId)
        this.fatherId = this.resTree2.data.data.id
      }
    },
    changeIsShow(name, val, row) {
      if (name === 'editEquipment') {
        this.isEditEquipment = val
        this.isRegistrationListShow = !val
        this.editEquipmentRow = row
      } else {
        this.isRegistrationListShow = val
      }
    },
    dialogShow() {
      this.editShow = true
      this.dialog.params = {
        resourcePid: '',
        name: ''
      }
      this.dialog.show = !this.dialog.show
    },
    // 点击节点选中
    nodeClickHandle(data) {
      console.log(data, 111111)
      this.dialog.params.resourcePid = data.resourceName
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    deleteAccount(e) {
      const h = this.$createElement
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
      this.$confirm('提示', {
        title: '提示',
        message: !this.isMore
          ? `确定删除分组${this.treeMsg}？`
          : h('div', [
              h('p', `此操作将删除${this.treeMsg}及其下级节点`),
              h('p', { style: 'position:relative;top:20px;' }, '确定删除？')
            ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        videoAreaDelete(this.deviceDetailsId)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.init(this.activeName)
            } else {
              this.$message({
                type: 'warning',
                message: res.data.msg
              })
            }
          })
          .catch((error) => {
            console.log(11111, error)
          })
      })
    },
    submit(formName) {
      this.isClick = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '新建安防通道资源':
              this.dialog.params.resourcePid = this.Id
              videoAreaAdd(this.dialog.params)
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建通道成功'
                    })
                    this.dialog.show = false
                    this.editShow = false
                    this.isClick = false
                  }
                })
                .catch((error) => {
                  this.isClick = false
                })
              if (this.activeName !== '编码器') {
                this.init('通道')
                this.$refs.channel.getList()
              } else {
                this.init('编码器')
                this.$refs.encoder.getList()
              }

              break
            default:
              break
          }
        }
      })
    },
    dialogMoveShow() {
      this.$refs.moveTree.changeMoveTreeShow()
    },
    changeSort(val, id) {
      if (val === 0) {
        videoAreaSort({
          id,
          moveOp: val
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '移动成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.data
            })
          }
          this.init(this.activeName)
        })
      } else {
        videoAreaSort({
          id,
          moveOp: val
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '移动成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.data
            })
          }
          this.init(this.activeName)
        })
      }
    },
    handleClose(done) {
      done()
    },
    treeSort(val) {
      if (val === 1) {
        this.isClickTreeSort = false
      } else {
        this.isClickTreeSort = true
      }
    },
    handleClick(val, event) {
      console.log(val)
      this.activeName = val.label
      if (this.activeName !== '编码器') {
        this.treeList = [this.resTree1.data.data]
        this.$refs.deviceTree.chooseId(this.channelDetailsId)
      } else {
        this.treeList = [this.resTree2.data.data]
        this.$refs.deviceTree.chooseId(this.deviceDetailsId)
      }
    },
    childClickHandle(data) {
      this.fatherId = data.id
      if (this.activeName !== '编码器') {
        this.$refs.channel.getList(data.id)
        this.channelDetailsId = data.id
      } else {
        this.$refs.encoder.getList(data.id)
        this.deviceDetailsId = data.id
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .securityArea_container > .btn-lists > .el-button {
  margin-left: 0 !important;
}

::v-deep .equipmentTree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 没有展开且有子节点
::v-deep .equipmentTree .el-icon-caret-right:before {
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
  .equipmentTree
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
::v-deep .equipmentTree .el-tree-node__expand-icon.is-leaf::before {
  display: none;
}
::v-deep .el-tabs__content {
  flex: 1;
}
::v-deep .el-tabs--border-card {
  box-shadow: none;
  border: 0;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}
::v-deep .el-dialog__footer {
  padding: 0;
}
.dialog-footer {
  width: 100%;
  height: 52px;
  line-height: 52px;
  position: relative;
  bottom: 0;
  right: 0px;
  text-align: right;
  border-top: 1px solid #eaeaea;
  > .el-button {
    margin-right: 20px;
  }
  .svg-btn {
    position: relative;
    top: 1px;
    left: -4px;
  }
}
.group_name_lists {
  display: flex;
  justify-content: space-between;
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
::v-deep .unitTree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 没有展开且有子节点
::v-deep .unitTree .el-icon-caret-right:before {
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
  .unitTree
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
::v-deep .unitTree .el-tree-node__expand-icon.is-leaf::before {
  display: none;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}
::v-deep .el-dialog__footer {
  padding: 0;
}
// 去掉顶部线条
::v-deep .unit-tree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .unit-tree > .el-tree-node::before {
  border-left: none;
}
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}

.equipmentTree {
  margin-top: -8px;
}
.add_resource {
  margin: 20px;
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
      .btn-lists {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0 10px;
        .btn-span {
          position: relative;
          top: -2px;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
        }
        .svg-btn {
          position: relative;
          top: -1px;
          left: -6px;
        }
        .el-button {
          width: 70px;
          height: 32px;
        }
        .sort_div {
          display: inline-block;
          line-height: 32px;
          white-space: nowrap;
          text-align: center;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          width: 70px;
          height: 32px;
          .btn-span {
            position: relative;
            top: -2px;
            font-size: 14px;
            color: #606266;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
          }
          .svg-btn {
            position: relative;
            top: 1px;
            left: -6px;
          }
        }
        .clicked-button {
          border: 1px solid #0270ff !important;
          .btn-span {
            color: #0270ff !important;
          }
        }
      }
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
