<template>
  <div class="main">
    <div class="panel-header-box">
      <div class="panel-header-box-border">网关管理</div>
    </div>
    <div class="main-content">
      <!-- <div class="gatewayModuleManagement_container">
        <leftTree
          :treeData="treeList"
          @childClickHandle="childClickHandle"
          :defaultPropsName="areaNames"
          class="gatewayModuleManagementTree"
        />
      </div> -->
      <div class="p10 right-table">
        <div class="table-list">
          <div class="table-content">
            <el-table
              ref="registrationListTable"
              class="table-content-bottom"
              :data="tableData"
              border
              :header-cell-style="{
                background: 'rgba(0, 75, 173, 0.06)',
                fontSize: '14px',
                fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
                fontWeight: 'bold',
                color: '#333333'
              }"
            >
              <!-- <el-table-column type="selection" width="80" align="center"> -->
              <!-- </el-table-column> -->
              <el-table-column
                type="index"
                width="50"
                align="center"
                label="序号"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="模块名称"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="serialNum"
                label="序列号"
                :show-overflow-tooltip="true"
              />
              <el-table-column prop="signType" label="通讯模式">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.signType === 1"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >MQ</span
                  >
                  <span
                    v-else
                    style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
                    >HTTP</span
                  >
                </template>
              </el-table-column>
              <el-table-column prop="gatewayType" label="网关类型">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.gatewayType === 1"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >DEVICE</span
                  >
                  <span
                    v-if="scope.row.gatewayType === 2"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >NVR</span
                  >
                  <span
                    v-if="scope.row.gatewayType === 3"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >DVR</span
                  >
                  <span
                    v-if="scope.row.gatewayType === 4"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >CVR</span
                  >
                  <span
                    v-else
                    style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
                    >OTHER</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="protocol"
                label="协议"
                width="120"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="ip"
                label="IP"
                :show-overflow-tooltip="true"
              />

              <el-table-column prop="port" label="端口" width="80" />
              <el-table-column prop="onlineState" label="状态" width="80">
                <template slot-scope="scope">
                  <span
                    :class="scope.row.onlineState === 1 ? 'yuan' : 'yuan1'"
                  ></span>
                  <span
                    v-if="scope.row.onlineState === 1"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >在线</span
                  >
                  <span
                    v-else
                    style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
                    >离线</span
                  >
                </template>
              </el-table-column>
              <el-table-column width="180" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="editData(scope.row)"
                    >编辑
                  </el-button>
                  <!-- <el-button type="text" @click="showDetails(scope.row)"
                    >详情
                  </el-button> -->
                  <el-button type="text" @click="showCorrelationPage(scope.row)"
                    ><span class="delete-button">关联</span></el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :pages-data="params"
              @size-change="sizeChange"
              @current-change="currentChange"
            />
          </div>
        </div>
      </div>

      <el-dialog title="编辑" :visible.sync="dialogShow" width="600px">
        <div slot="title" class="dialog-title">
          <LineFont
            :line-title="lineTitle"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
        </div>
        <div>
          <el-form label-width="100px" :model="dialogForm">
            <el-form-item label="模块名称：">
              <el-input
                v-model="dialogForm.name"
                style="width: 436px"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="序列号：">
              <el-input
                v-model="dialogForm.serialNum"
                style="width: 436px"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="通讯模式：">
              <el-select
                v-model="dialogForm.signType"
                placeholder="请选择"
                style="width: 436px"
                disabled
              >
                <el-option
                  v-for="o in signTypeOptions"
                  :label="o.label"
                  :value="o.value"
                  :key="o.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="网关类型：" style="width: 436px">
              <el-select
                v-model="dialogForm.gatewayType"
                placeholder="请选择"
                style="width: 436px"
                disabled
              >
                <el-option
                  v-for="o in gatewayTypeOptions"
                  :label="o.label"
                  :value="o.value"
                  :key="o.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="协议：">
              <el-input
                v-model="dialogForm.protocol"
                style="width: 436px"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="IP：">
              <el-input
                v-model="dialogForm.ip"
                style="width: 436px"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="端口：">
              <el-input
                v-model="dialogForm.port"
                style="width: 436px"
                disabled
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-footer">
          <el-button @click="dialogShow = false">取消</el-button>
          <el-button type="primary" @click="save(1)"
            ><svg-icon class="svg-btn" icon-class="save" />确认</el-button
          >
        </div>
      </el-dialog>

      <el-dialog title="关联" :visible.sync="dialogShowDetails" width="30%">
        <div slot="title" class="dialog-title">
          <LineFont
            :line-title="lineTitle1"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
        </div>
        <div>
          <el-form
            label-width="auto"
            :model="dialogForm"
            style="margin-left: 20px"
          >
            <el-form-item label="模块名称：">
              <el-input
                v-model="dialogShowDetailsForm.name"
                style="width: 336px"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="流媒体调度服务模块：">
              <el-select
                v-model="dialogShowDetailsForm.gatewayType"
                placeholder="请选择"
                style="width: 336px"
              >
                <el-option
                  v-for="o in allNorthTypeOptions"
                  :label="o.label"
                  :value="o.value"
                  :key="o.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-footer">
          <el-button @click="dialogShowDetails = false">取消</el-button>
          <el-button type="primary" @click="save(2)"
            ><svg-icon class="svg-btn" icon-class="save" />确认</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import pagination from '@/components/Pagination/index.vue'
import LineFont from '@/components/LineFont'
import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
import {
  getModuleLists,
  updateModuleLists,
  getAllNorthLists,
  gatewayCorrelation,
  getGatewayId
} from '@/api/method/moduleManagement'
export default {
  name: '',
  components: { leftTree, pagination, LineFont },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      lineTitle: {
        title: '编辑',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '关联',
        notShowSmallTitle: false
      },
      allNorthTypeOptions: [],
      signTypeOptions: [
        {
          label: 'MQ',
          value: 1
        },
        {
          label: 'HTTP',
          value: 0
        }
      ],
      gatewayTypeOptions: [
        {
          label: 'DEVICE',
          value: 1
        },
        {
          label: 'NVR',
          value: 2
        },
        {
          label: 'DVR',
          value: 3
        },
        {
          label: 'CVR',
          value: 4
        },
        {
          label: 'OTHER5',
          value: 5
        }
      ],
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
      treeList: [
        {
          name: '中央管理服务器',
          areaNames: '中央管理服务器',
          id: '1',
          level: 1,
          childList: [
            {
              name: '网关模块',
              areaNames: '网关模块',
              id: '1-1',
              level: 2
            },
            {
              name: '流媒体调度服务模块',
              areaNames: '流媒体调度服务模块',
              id: '1-2',
              level: 2
            }
          ]
        }
      ],
      dialogShow: false,
      dialogForm: {
        protocol: '',
        name: '',
        port: '',
        ip: '',
        serialNum: '',
        signType: '',
        gatewayType: ''
      },
      dialogShowDetailsForm: {
        name: '',
        gatewayType: ''
      },
      dialogShowDetails: false,
      detailsId: '',
      areaNames: 'areaNames',
      tableData: [],
      editId: '',
      correlationId: ''
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      await getModuleLists({
        num: this.params.pageSize,
        page: this.params.pageNum
      }).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.params.total = res.data.data.total
          this.params.pages = res.data.data.pages
          this.params.current = res.data.data.current
        }
      })
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.init()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.init()
    },
    childClickHandle(data) {
      console.log(data, 'childClickHandle')
      if (data.areaName === '网关模块') {
        this.$router.replace({ path: '/gatewayModuleManagement' })
      } else {
        this.$router.replace({ path: '/ModuleManagement' })
      }
    },
    editData(row) {
      this.dialogShow = true
      const {
        protocol,
        name,
        port,
        ip,
        serialNum,
        signType,
        dispatchId,
        gatewayType
      } = row
      this.dialogForm.signType = signType
      this.dialogForm.gatewayType = String(gatewayType)
      this.dialogForm.protocol = protocol
      this.dialogForm.name = name
      this.dialogForm.port = port
      this.dialogForm.ip = ip
      this.dialogForm.serialNum = serialNum
      this.editId = row.id
    },
    async showCorrelationPage(row) {
      console.log('row~~~~~~~', row)
      this.dialogShowDetailsForm.name = row.name

      await getGatewayId(row.id).then((res) => {
        if (res.data.code === 0) {
          this.dialogShowDetailsForm.gatewayType = res.data.data
        }
      })
      this.allNorthTypeOptions = [
        {
          label: '',
          value: null
        }
      ]
      await getAllNorthLists().then((res) => {
        if (res.data.code === 0) {
          this.correlationId = row.id
          this.dialogShowDetails = true
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.name
            obj.value = item.dispatchId
            this.allNorthTypeOptions.push(obj)
          })
        }
      })
    },
    async save(val) {
      if (val === 1) {
        await updateModuleLists({
          gatewayId: this.editId,
          name: this.dialogForm.name
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.dialogShow = false
            this.init()
          }
        })
      } else {
        await gatewayCorrelation({
          gatewayId: this.correlationId,
          dispatchId: this.dialogShowDetailsForm.gatewayType
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '关联成功'
            })
            this.dialogShowDetails = false
            this.init()
          }
        })
      }
    },
    showDetails() {
      this.dialogShowDetails = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table::before {
  height: 0 !important;
}
::v-deep .el-table--border {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .gatewayModuleManagementTree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 没有展开且有子节点
::v-deep .gatewayModuleManagementTree .el-icon-caret-right:before {
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
  .gatewayModuleManagementTree
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
::v-deep
  .gatewayModuleManagementTree
  .el-tree-node__expand-icon.is-leaf::before {
  display: none;
}

::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}
::v-deep .el-dialog__body {
  padding: 30px 0 0 0;
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

::v-deep .table-content-bottom .el-table__fixed-right {
  height: 100% !important;
}
::v-deep .el-table--enable-row-transition {
  // height: 100% !important;
}
// 滚动条大小设置
::v-deep .table-content-bottom::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
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
    height: calc(100% - 50px);
    display: flex;
    justify-content: space-between;
    .gatewayModuleManagement_container {
      height: calc(100% - 50px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    }
    .right-table {
      width: 100%;
      margin: 10px;
      position: relative;
      .table-list {
        width: calc(100% - 0px);
        height: calc(100% - 22px);
        background: #ffffff;
        box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        padding: 18px;
        // margin: 20px;
        .table-content-bottom {
          height: calc(100% - 100px);
          overflow-y: auto;
        }
        .yuan {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #359000;
        }
        .yuan1 {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b1b1b1;
        }
      }
    }
    .right-table-else {
      width: calc(100% - 340px);
      margin: 6px 0 0 -10px;
      position: relative;
    }
  }
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
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
</style>
