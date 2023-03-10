<template>
  <div class="encoder-content">
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="外类类型:">
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
          <el-button @click="resetData"
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
        <el-checkbox v-model="includeEquipment" class="table-content-top-check"
          >包含下级组织</el-checkbox
        >
        <div class="btn-lists">
          <el-button @click="deteleAll()" style="width: 100px"
            ><svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">批量删除</span></el-button
          >
          <el-button @click="moveEquipment"
            ><svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">移动</span></el-button
          >
          <el-button type="primary" @click="goChannelDiscovery"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span></el-button
          >
        </div>
      </div>
      <el-table
        ref="encoderTable"
        class="channel-table"
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
        <el-table-column type="selection" width="80" align="center">
        </el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="channelName"
          label="通道名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="areaNames"
          label="所属区域"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="channelCode"
          label="通道编码"
          :show-overflow-tooltip="true"
          width="160"
        />
        <el-table-column prop="deviceName" label="所属设备" width="120" />

        <el-table-column prop="channelType" label="通道类型" width="120">
          <template slot-scope="scope">
            <!-- <span :class="scope.row.deviceType === 1 ? 'yuan' : 'yuan1'"></span> -->
            <span
              v-if="scope.row.deviceType === 0"
              style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
              >视频</span
            >
            <span
              v-else-if="scope.row.deviceType === 1"
              style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
              >音频</span
            >
            <span
              v-else
              style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
              >告警</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="120" />
        <el-table-column prop="port" label="端口" width="80" />
        <el-table-column prop="manufacturer" label="设备厂家" width="120" />
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
            <el-button type="text" @click="editData(scope.row)"
              >编辑
            </el-button>
            <!-- <el-button type="text" @click="restart(scope.row.id)"
              >重启
            </el-button>
            <el-button type="text" @click="synchronizationData(scope.row.id)"
              >同步
            </el-button>
            <el-button type="text" @click="deploymentData(scope.row.id)"
              >布防
            </el-button> -->
            <el-button type="text" @click="deleteEncoder(scope.row)"
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
        <leftTree />
      </div>

      <div class="dialog-footer">
        <el-button @click="dialogShow = false">取消</el-button>
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
  getChannelById,
  deleteChannels,
  deleteChannel
} from '@/api/method/channel'

import { getManufacturerDictionaryList } from '@/api/method/dictionary'
import { Local } from '@/utils/storage'

export default {
  name: '',
  components: { pagination, leftTree, LineFont },
  props: {
    detailsId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
        num: 3,
        dialogEquipmentName:
          '海康NVR ; 海康IPC ; 34020000001320000028 ; 海康NVR ; 海康IPC ; 34020000001320000028 ; 海康NVR ; 海康IPC ; 34020000001320000028 ;'
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
      deviceTypesOptionsList: [],
      checked: false,
      dialogShow: false,
      dialogShow1: false,
      dialogTableData: [
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        }
      ],
      tableData: [
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        }
      ]
    }
  },
  created() {
    this.params.pageNum = Local.get('channelPageNum')
    Local.remove('channelPageNum')
  },
  mounted() {
    this.getList()
    this.getDeviceTypesDictionaryList()
  },
  methods: {
    getList(orgId) {
      // : '1620396812466147329'
      getChannelById({
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        videoAreaId: orgId ? orgId : 1,
        includeEquipment: this.includeEquipment,
        ...this.searchParams
      }).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.records
          this.params.total = res.data.total
          this.params.pages = res.data.pages
          this.params.current = res.data.current
        }
      })
    },
    async getDeviceTypesDictionaryList() {
      await getManufacturerDictionaryList('Appearance').then((res) => {
        if (res.code === 0) {
          res.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.deviceTypesOptionsList.push(obj)
          })
        }
      })
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    editData(row) {
      Local.set('channelPageNum', this.params.pageNum)
      Local.set('equipmentActiveName', '通道')
      this.$router.push({
        path: `/editChannel`,
        query: {
          row: row
        }
      })
    },
    deploymentData() {
      this.dialogShow1 = true
    },
    deteleAll(row) {
      this.$confirm('删除后数据无法恢复，是否确认全部删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const roleIds = []
        // console.log('this.$refs.encoderTable.selection',this.$refs)
        this.$refs.encoderTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        deleteChannels(roleIds).then((res) => {
          if (res.code === 0) {
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
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteChannel(row.id).then((res) => {
          if (res.code === 0) {
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
    resetData() {
      this.searchParams = {
        deviceType: '',
        ip: '',
        onlineState: ''
      }
      this.params.pageNum = 1
      this.getList()
    },
    cxData() {
      this.getList()
    },
    goChannelDiscovery() {
      this.$router.push(`/channelDiscovery`)
    },
    moveEquipment() {
      this.dialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}

// 滚动条大小设置
::v-deep .channel-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .channel-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .channel-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .channel-table::-webkit-scrollbar-corner {
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
    .channel-table {
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
    height: calc(100% - 40px);
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
