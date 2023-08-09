<template>
  <div class="encoder-content" ref="appRef">
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="设备类型:">
          <el-select
            v-model="searchParams.deviceType"
            class="mr10"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="obj in deviceTypesOptionsList"
              :key="obj.value"
              :label="obj.label"
              :value="obj.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="searchParams.onlineState"
            class="mr10"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="obj in optionsList"
              :key="obj.value"
              :label="obj.label"
              :value="obj.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="ip地址:">
          <el-input
            v-model="searchParams.ip"
            placeholder="请输入IP地址"
            class="mr10"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          style="float: right; margin-right: 20px"
          class="form-btn-list"
        >
          <el-button @click="resetData($event)"
            ><svg-icon class="svg-btn" icon-class="cz" />
            <span class="btn-span">重置</span></el-button
          >
          <el-button type="primary" @click="cxData"
            ><svg-icon class="svg-btn" icon-class="cx" />
            <span class="btn-span">搜索</span></el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <div class="table-content-top">
        <el-checkbox
          v-model="includeEquipment"
          class="table-content-top-check"
          @change="changeOrganization"
          >包含下级组织</el-checkbox
        >
        <div class="btn-lists">
          <el-button
            v-permission="['/expansion/device/batchDelete', 4]"
            @click="deteleAll($event)"
            style="width: 100px"
            plain
            ><svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">批量删除</span></el-button
          >
          <el-button
            v-permission="['/expansion/device/move', 2]"
            @click="moveEquipment"
            ><svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">移动</span></el-button
          >
          <el-button
            v-permission="['/expansion/device/unregister/list', 1]"
            @click="goRegistrationList"
            style="width: 120px"
            ><svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">待注册列表</span></el-button
          >
          <el-button
            v-permission="['/expansion/device/add', 2]"
            type="primary"
            @click="addEquipment"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span></el-button
          >
        </div>
      </div>
      <el-table
        ref="encoderTable"
        class="encoder-table"
        :data="tableData"
        border
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
        v-loading="tableLoading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#fff"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80" align="center">
        </el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="areaNames"
          label="所属区域"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="deviceId"
          label="国标编码"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="deviceType" label="设备类型" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.deviceType === 1">DVR</span>
            <span v-else-if="scope.row.deviceType === 2">NVR</span>
            <span v-else-if="scope.row.deviceType === 3">CVR</span>
            <span v-else-if="scope.row.deviceType === 4">DVS</span>
            <span v-else>IPC</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址"
          :show-overflow-tooltip="true"
        />

        <el-table-column prop="port" label="端口" width="80" />
        <el-table-column prop="manufacturer" label="设备厂家" width="100">
          <template slot-scope="scope">
            <span v-for="item in manufacturerTypeOptions" :key="item.value">{{
              item.value.toLowerCase() === scope.row.manufacturer.toLowerCase()
                ? item.label
                : ''
            }}</span>
          </template>
        </el-table-column>
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
        <el-table-column width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['/expansion/channel/channelSync', 1]"
              type="text"
              :disabled="scope.row.onlineState !== 1"
              @click="synchronizationData(scope.row.id)"
              >同步
            </el-button>
            <el-button
              v-permission="['/expansion/device/edit', 3]"
              type="text"
              @click="goEditPage(scope.row)"
              >编辑
            </el-button>
            <el-button
              v-permission="['/expansion/device/delete', 4]"
              type="text"
              @click="deleteEncoder(scope.row)"
              ><span class="delete-button">删除</span></el-button
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

    <el-dialog title="移动位置" :visible.sync="dialogShow" width="30%">
      <div slot="title" class="dialog-title">
        <LineFont
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <el-form label-width="100px" :model="dialogForm">
        <el-form-item label="设备数量：">
          {{ dialogForm.num }}
        </el-form-item>
        <el-form-item label="设备名称：">
          <span class="dialogEquipmentName">{{
            dialogForm.dialogEquipmentName
          }}</span>
        </el-form-item>
      </el-form>
      <div class="securityArea_container">
        <leftTree
          :treeData="treeList"
          @childClickHandle="childClickHandle"
          :defaultPropsName="areaNames"
        />
      </div>

      <div class="dialog-footer">
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary" @click="dialogMove"
          ><svg-icon class="svg-btn" icon-class="save" />确认</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="选择编码器" :visible.sync="dialogShow1" width="80%">
      <div slot="title" class="dialog-title">
        <LineFont
          :line-title="lineTitle1"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <el-form label-width="80px" :model="dialogForm1">
        <el-row>
          <el-col :span="8">
            <el-form-item label="当前目录">
              <el-select
                v-model="dialogForm1.region"
                placeholder="请选择活动区域"
              >
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="float: right">
            <el-form-item>
              <el-input
                placeholder="请输入搜索关键字"
                suffix-icon="el-icon-search"
                class="search-input"
                v-model="dialogForm1.inputValue"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        ref="dialogEncoder"
        class="table-content-bottom"
        :data="dialogTableData"
        border
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
      >
        <el-table-column type="selection" width="80" align="center">
        </el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="areaNames"
          label="所属区域"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="deviceId"
          label="国标编码"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="ip"
          label="IP地址"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="manufacturer" label="设备厂家" width="80" />
        <el-table-column prop="city" label="所属行政区域" width="240" />
      </el-table>

      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />

      <div class="dialog-footer">
        <el-button @click="dialogShow1 = false">取消</el-button>
        <el-button type="primary"
          ><svg-icon class="svg-btn" icon-class="save" />确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import LineFont from '@/components/LineFont'
import {
  getEncoderById,
  deleteEncoders,
  deleteEncoder,
  moveEncoder,
  syncChannel
} from '@/api/method/encoder'

import { getGroupDictLists } from '@/api/method/dictionary'
import { Local } from '@/utils/storage'

// import drawMixin from '@/utils/drawMixin'

export default {
  name: '',
  components: { pagination, leftTree, LineFont },
  // mixins: [drawMixin],
  props: {
    detailsId: {
      type: String,
      default: ''
    },
    treeList: {
      type: Array,
      default: () => []
    },
    manufacturerTypeOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableLoading: true,
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      includeEquipment: true,
      lineTitle: {
        title: '移动位置',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '选择编码器',
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
      dialogForm: {
        num: null,
        dialogEquipmentName: ''
      },
      dialogForm1: {
        inputValue: ''
      },
      searchParams: {
        deviceType: '',
        ip: '',
        onlineState: ''
      },
      query: {},
      deviceTypesOptionsList: [],
      optionsList: [
        {
          label: '离线',
          value: 0
        },
        {
          label: '在线',
          value: 1
        }
      ],
      checked: false,
      dialogShow: false,
      dialogShow1: false,
      dialogTableData: [],
      tableData: [],
      areaNames: 'resourceName',
      idList: [],
      dialogResourceValue: '',
      resDetailsId: ''
    }
  },
  watch: {
    detailsId(newValue, oldValue) {
      this.resDetailsId = newValue
    },
    deep: true
  },
  created() {
    this.params.pageNum = Local.get('encoderPageNum')
    Local.remove('encoderPageNum')

    this.getDeviceTypesDictionaryList()
  },
  mounted() {
    setTimeout(() => {
      // this.getList()
    }, 500)
  },
  methods: {
    async getList(id) {
      await getEncoderById({
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        videoAreaId: id ? id : this.resDetailsId,
        includeEquipment: this.includeEquipment,
        ...this.searchParams
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.records
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.current
            this.tableLoading = false
          } else {
            this.tableLoading = false
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    changeTableLoading() {
      this.tableLoading = true
    },
    async getDeviceTypesDictionaryList() {
      await getGroupDictLists('DeviceTypes').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.deviceTypesOptionsList.push(obj)
          })
        }
      })
    },
    handleSelectionChange(data) {
      const resName = []
      this.idList = []
      if (data && data.length > 0) {
        data.map((item) => {
          this.idList.push(item.id)
          resName.push(item.name)
        })
        this.dialogForm.num = data.length
        this.dialogForm.dialogEquipmentName = resName.join(';')
      }
    },
    childClickHandle(data) {
      this.dialogResourceValue = data.resourceValue
    },

    dialogMove() {
      moveEncoder({
        idList: this.idList,
        pResourceValue: this.dialogResourceValue
      }).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '移动成功'
          })
          this.dialogShow = false
          this.params.pageNum = 1
          this.getList()
        }
      })
    },
    changeOrganization() {
      this.getList()
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    synchronizationData(id) {
      syncChannel(id).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '同步成功'
          })
          this.params.pageNum = 1
          this.getList()
        }
      })
    },
    goEditPage(row) {
      Local.set('encoderPageNum', this.params.pageNum)
      Local.set('equipmentActiveName', '编码器')
      this.$emit('changeIsShow', 'editEquipment', true, row, '1')
    },
    deploymentData() {
      this.dialogShow1 = true
    },
    deteleAll(e) {
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
      this.$confirm(
        `此操作将同时删除设备及归属于设备的通道信息且不可恢复。确定删除所选的${
          this.$refs.encoderTable.selection.length > 0
            ? this.$refs.encoderTable.selection.length
            : 0
        }个设备？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const roleIds = []
        // console.log('this.$refs.encoderTable.selection',this.$refs)
        this.$refs.encoderTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        deleteEncoders(roleIds).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList()
          }
        })
      })
    },
    deleteEncoder(row) {
      this.$confirm(
        `此操作将同时删除设备及归属于设备的通道信息且不可恢复。确定删除设备${row.name}？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteEncoder(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList()
          }
        })
      })
    },
    resetData(e) {
      this.searchParams = {
        deviceType: '',
        ip: '',
        onlineState: ''
      }
      let target = e.target

      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
      this.params.pageNum = 1
      this.getList(this.$props.detailsId)
    },
    cxData() {
      this.getList()
    },

    addEquipment() {
      this.$emit('initChangeIsShow', true)
      this.$emit('changeIsShow', 'addEquipment', true)
    },

    goRegistrationList() {
      this.$emit('changeIsShow', 'registrationList', true)
    },

    moveEquipment(row) {
      if (this.$refs.encoderTable.selection.length === 0) {
        this.$message({
          message: '请勾选编码器',
          type: 'warning'
        })
        return
      }
      this.dialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table::before {
  height: 0 !important;
}
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}

// ::v-deep .encoder-table .el-table__fixed-right {
//   height: 100% !important;
// }
::v-deep .el-table--enable-row-transition {
  height: 100% !important;
}
// ::v-deep .el-table::before {
//   height: 0;
// }

// 滚动条大小设置
::v-deep .encoder-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .encoder-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .encoder-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .encoder-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}

.encoder-content {
  height: 100%;
  width: 100%;
  padding: 12px 20px 26px 20px;
  .search {
    width: 100%;
    min-height: 80px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      padding-top: 25px;
    }
  }
  .table-content {
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 17px;
    width: 100%;
    height: calc(100% - 96px);
    margin-top: 16px;
    .table-content-top {
      .table-content-top-check {
        float: left;
        margin-bottom: 30px;
      }
      .btn-lists {
        float: right;
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
          width: 80px;
          height: 32px;
        }
      }
    }
    .encoder-table {
      max-height: calc(100% - 145px);
      overflow-y: auto;
    }
  }
  .delete-button {
    color: red !important;
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

  .securityArea_container {
    height: 500px;
    width: 310px;
    margin: 10px;
    // background: #ffffff;
    // box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
}
.form-btn-list {
  .btn-span {
    position: relative;
    top: -1px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
  }
  .svg-btn {
    position: relative;
    top: -1px;
    left: -6px;
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
