<template>
  <div class="main">
    <div
      style="height: 100%"
      v-show="
        !isRegistrationListShow &&
        !isEditEquipment &&
        !isAddEquipment &&
        !isChannelDiscovery &&
        !isEditChannel
      "
    >
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
            :hasEdit="hasEdit"
            @childClickHandle="childClickHandle"
            @changeSort="changeSort"
            @editTree="editTree"
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
                :manufacturerTypeOptions="manufacturerTypeOptions"
                @changeIsShow="changeIsShow"
                @initChangeIsShow="initChangeIsShow"
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
                :manufacturerTypeOptions="manufacturerTypeOptions"
                :appearanceTypeOptions="appearanceTypeOptions"
                @changeIsShow="changeIsShow"
                @initChannelDiscovery="initChannelDiscovery"
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
            <el-form-item label="目录名称" prop="name">
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

      <el-dialog
        v-if="editShow1"
        :title="dialog1.title"
        :visible.sync="dialog1.show"
        width="600px"
        :before-close="handleClose"
      >
        <div slot="title" class="dialog-title">
          <LineFont
            :line-title="lineTitle1"
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
            :model="dialog1.params"
            :rules="dialogRules1"
            @keyup.enter="submit('accountForm')"
          >
            <el-form-item label="安防通道名称" prop="resourceName">
              <el-input
                v-model="dialog1.params.resourceName"
                style="width: 436px"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialog1.show = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="isClick1"
            @click="submit1('accountForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <moveTree
        ref="moveTree"
        :treeData="treeList"
        :fatherId="fatherId"
        :deleteObj="deleteObj"
        :activeName="activeName"
        @init="init"
      />
    </div>

    <RegistrationList
      v-show="isRegistrationListShow"
      ref="registrationList"
      @changeIsShow="changeIsShow"
      @init="init"
    />

    <AddEquipment
      v-show="isAddEquipment"
      ref="addEquipment"
      :treeList="treeList"
      :manufacturerTypeOptions="manufacturerTypeOptions"
      :transportProtocolTypeOptions="transportProtocolTypeOptions"
      @changeIsShow="changeIsShow"
      @init="init"
      @initEncoderList="initEncoderList"
    />

    <EditEquipment
      v-show="isEditEquipment"
      ref="editEquipment"
      :editEquipmentRow="editEquipmentRow"
      :treeList="treeList"
      :resType="resType"
      :manufacturerTypeOptions="manufacturerTypeOptions"
      :transportProtocolTypeOptions="transportProtocolTypeOptions"
      @changeIsShow="changeIsShow"
      @invokeRegistrationList="invokeRegistrationList"
      @init="init"
      @initEncoderList="initEncoderList"
    />
    <EditChannel
      v-show="isEditChannel"
      ref="editChannel"
      :treeList="treeList"
      :editChannelRow="editChannelRow"
      :appearanceTypeOptions="appearanceTypeOptions"
      @changeIsShow="changeIsShow"
      @init="init"
      @initChannelList="initChannelList"
    />

    <ChannelDiscovery
      v-show="isChannelDiscovery"
      ref="channelDiscovery"
      :treeList="treeList"
      @changeIsShow="changeIsShow"
      @init="init"
      @initChannelList="initChannelList"
    />
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import Encoder from './components/Encoder.vue'
import Channel from './components/Channel.vue'
import LineFont from '@/components/LineFont'
import moveTree from './components/MoveTree'
import RegistrationList from './components/RegistrationList'
import EditEquipment from './components/EditEquipment'
import AddEquipment from './components/AddEquipment'
import ChannelDiscovery from './components/ChannelDiscovery'
import EditChannel from './components/EditChannel'

import {
  deviceVideoAreaList,
  videoAreaAdd,
  videoAreaEdit,
  videoAreaSort,
  videoAreaDelete
} from '@/api/method/encoder'
import { channelVideoAreaList } from '@/api/method/channel'
import { getGroupDictLists } from '@/api/method/dictionary'
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
    AddEquipment,
    ChannelDiscovery,
    EditChannel,
    moveTree
  },
  data() {
    return {
      isRegistrationListShow: false,
      isEditEquipment: false,
      isAddEquipment: false,
      isChannelDiscovery: false,
      isEditChannel: false,
      editChannelRow: {},
      hasEdit: true,
      editEquipmentRow: {},
      activeName: '编码器',
      treeList: [],
      Ids: [],
      resTree1: {},
      resTree2: {},
      channelDetailsId: '',
      deviceDetailsId: '',
      areaNames: 'resourceName',
      changRight: '',
      isShow: false,
      isClickTreeSort: true,
      lineTitle: {
        title: '新建目录',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '编辑安防通道资源',
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
      editShow1: false,
      dialog: {
        show: false,
        title: '新建安防通道资源',
        params: {
          resourcePid: '',
          name: ''
        }
      },
      newResourceKey: '',
      dialog1: {
        show: false,
        title: '编辑安防通道资源',
        params: {
          resourceName: '',
          resourceValue: '',
          resourceKey: ''
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
      dialogRules1: {
        resourceName: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'blur'
          }
        ]
      },
      defaultProps: {
        children: 'childList',
        label: 'resourceName'
      },
      Id: '',
      fatherId: '',
      treeValue: '',
      isClick: false,
      isClick1: false,
      treeMsg: '',
      isMore: false,
      deleteObj: {},
      resType: '',
      manufacturerTypeOptions: [],
      transportProtocolTypeOptions: [],
      appearanceTypeOptions: []
    }
  },
  created() {
    this.activeName = Local.get('equipmentActiveName')
      ? Local.get('equipmentActiveName')
      : '编码器'
    Local.remove('equipmentActiveName')

    this.init('编码器', false)
  },
  mounted() {
    this.getEquipmentCompanyDictionaryList()
    this.getTransportProtocolDictionaryList()
    this.getAppearanceDictionaryList()
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
    async init(name, isMoved) {
      if (this.activeName !== '编码器') {
        this.resTree1 = await channelVideoAreaList()
        this.treeList = this.resTree1.data.data ? [this.resTree1.data.data] : []
        this.fatherId = this.resTree1.data.data
          ? this.resTree1.data.data.id
          : ''
        this.newResourceKey = this.resTree1.data.data
          ? this.resTree1.data.data.resourceKey
          : ''
        this.treeValue = this.resTree1.data.data
          ? this.resTree1.data.data.resourceValue
          : ''
        this.deleteObj = this.resTree1.data.data
        if (!isMoved) {
          this.channelDetailsId = this.resTree1.data.data
            ? this.resTree1.data.data.id
            : ''

          this.$refs.channel.getList(this.channelDetailsId)
        }

        this.$refs.deviceTree.chooseId(this.channelDetailsId)
      } else {
        this.resTree2 = await deviceVideoAreaList()
        this.treeList = this.resTree2.data.data ? [this.resTree2.data.data] : []
        this.fatherId = this.resTree2.data.data
          ? this.resTree2.data.data.id
          : ''
        this.newResourceKey = this.resTree2.data.data
          ? this.resTree2.data.data.resourceKey
          : ''
        this.treeValue = this.resTree2.data.data
          ? this.resTree2.data.data.resourceValue
          : ''
        this.deleteObj = this.resTree2.data.data
        if (!isMoved) {
          this.deviceDetailsId = this.resTree2.data.data
            ? this.resTree2.data.data.id
            : ''

          this.$refs.encoder.getList(this.deviceDetailsId)
        }

        this.$refs.deviceTree.chooseId(this.deviceDetailsId)
      }
    },

    async initChannelDiscovery() {
      this.$refs.channelDiscovery.init()
    },

    async initEncoderList() {
      this.$refs.encoder.getList(this.deviceDetailsId)
    },
    async initChannelList() {
      this.$refs.channel.getList(this.channelDetailsId)
    },
    async getEquipmentCompanyDictionaryList() {
      await getGroupDictLists('EquipmentCompany').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.manufacturerTypeOptions.push(obj)
          })
        }
      })
    },
    async getTransportProtocolDictionaryList() {
      await getGroupDictLists('TransportProtocol').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj1 = {}
            obj1.label = item.itemName
            obj1.value = item.itemValue
            this.transportProtocolTypeOptions.push(obj1)
          })
        }
      })
    },
    async getAppearanceDictionaryList() {
      await getGroupDictLists('Appearance').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.appearanceTypeOptions.push(obj)
          })
        }
      })
    },
    changeIsShow(name, val, row, type) {
      switch (name) {
        case 'registrationList':
          this.isRegistrationListShow = val
          break
        case 'addEquipment':
          this.isAddEquipment = val
          break
        case 'editChannel':
          this.isEditChannel = val
          this.editChannelRow = row
          break

        case 'editEquipment':
          this.isEditEquipment = val
          this.editEquipmentRow = row
          this.resType = type
          break
        case 'channelDiscovery':
          this.isChannelDiscovery = val
          break
        default:
          break
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
    editTree(data) {
      console.log('data', data)
      this.editShow1 = true
      this.dialog1.params = {
        resourceName: data.resourceName,
        resourceValue: data.resourceValue,
        resourceKey: data.resourceKey
      }
      this.dialog1.show = !this.dialog1.show
    },
    // 点击节点选中
    nodeClickHandle(data) {
      console.log(data, 111111)
      this.dialog.params.resourcePid = data.resourceName
      this.Id = data.id
      this.treeValue = data.resourceValue
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
        videoAreaDelete({
          resourceKey: this.deleteObj.resourceKey,
          resourceValue: this.deleteObj.resourceValue
        })
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
              // this.dialog.params.resourcePid = this.treeValue
              videoAreaAdd({
                resourceKey: this.newResourceKey,
                pResourceValue: this.treeValue,
                name: this.dialog.params.name
              })
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建通道成功'
                    })
                    this.dialog.show = false
                    this.editShow = false
                    this.isClick = false
                    if (this.activeName !== '编码器') {
                      this.init('通道')
                      this.$refs.channel.getList()
                    } else {
                      this.init('编码器')
                      this.$refs.encoder.getList()
                    }
                  } else {
                    this.isClick = false
                  }
                })
                .catch((error) => {
                  this.isClick = false
                })

              break
            default:
              break
          }
        }
      })
    },
    submit1(formName) {
      this.isClick1 = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog1.title) {
            case '编辑安防通道资源':
              videoAreaEdit(this.dialog1.params)
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '编辑安防通道资源成功'
                    })
                    this.dialog1.show = false
                    this.editShow1 = false
                    this.isClick1 = false
                    if (this.activeName !== '编码器') {
                      this.init('通道')
                      this.$refs.channel.getList()
                    } else {
                      this.init('编码器')
                      this.$refs.encoder.getList()
                    }
                  } else {
                    this.isClick1 = false
                  }
                })
                .catch((error) => {
                  this.isClick1 = false
                })

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
    changeSort(val, data) {
      if (val === 0) {
        videoAreaSort({
          resourceKey: data.resourceKey,
          resourceValue: data.resourceValue,
          moveOp: val
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '移动成功'
            })
          }
          this.init(this.activeName, true)
        })
      } else {
        videoAreaSort({
          resourceKey: data.resourceKey,
          resourceValue: data.resourceValue,
          moveOp: val
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '移动成功'
            })
          }
          this.init(this.activeName, true)
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
    initChangeIsShow(val) {
      this.$refs.addEquipment.changeIsShow(val)
    },
    // 调用兄弟组件方法
    invokeRegistrationList() {
      this.$refs.registrationList.init()
    },
    handleClick(val, event) {
      this.activeName = val.label

      this.init(this.activeName, false)
      if (this.activeName !== '编码器') {
        this.$refs.deviceTree.chooseId(this.channelDetailsId)
        this.$refs.channel.changeTableLoading()
      } else {
        this.$refs.deviceTree.chooseId(this.deviceDetailsId)
        this.$refs.encoder.changeTableLoading()
      }
    },
    childClickHandle(data) {
      this.deleteObj = data
      this.fatherId = data.id
      if (this.activeName !== '编码器') {
        this.$refs.channel.getList(data.id)
        this.channelDetailsId = data.id
      } else {
        this.$refs.encoder.getList(data.id)
        this.deviceDetailsId = data.id
      }
      if (data.childList && data.childList.length > 0) {
        this.isMore = true
        this.treeMsg = data.resourceName
      } else {
        this.isMore = false
        this.treeMsg = data.resourceName
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
