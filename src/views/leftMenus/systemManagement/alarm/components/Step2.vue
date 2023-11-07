<template>
  <div class="step1-content">
    <div class="main-content">
      <div class="securityArea_container">
        <leftTree
          ref="deviceTree"
          class="equipmentTree"
          :treeData="treeList"
          :defaultPropsName="areaNames"
          @childClickHandle="childClickHandle"
        />
      </div>
      <div class="right-table">
        <div class="encoder-content" ref="appRef">
          <div class="search">
            <el-form
              ref="query"
              class="search-form"
              :inline="true"
              :model="searchParams"
              label-width="100px"
            >
              <el-form-item label="通道名称:">
                <el-input
                  v-model="searchParams.channelName"
                  placeholder="请输入"
                  class="mr10"
                  clearable
                ></el-input>
              </el-form-item>

              <el-form-item label="设备名称:">
                <el-input
                  v-model="searchParams.deviceName"
                  placeholder="请输入"
                  class="mr10"
                  clearable
                ></el-input>
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
            </div>

            <el-table
              ref="timeTemTable2"
              class="encoder-table"
              :data="tableData"
              border
              @selection-change="handleSelectChange"
              @select="handleSelect"
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
            >
              <el-table-column type="selection" width="80" align="center">
              </el-table-column>
              <el-table-column
                type="index"
                width="50"
                align="center"
                label="序号"
              >
              </el-table-column>
              <el-table-column
                prop="channelName"
                label="通道名称"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="channelId"
                label="通道编号"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="deviceName"
                label="所属设备"
                :show-overflow-tooltip="true"
              />

              <el-table-column
                prop="deviceId"
                label="设备编号"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="schemeName"
                label="预案名称"
                :show-overflow-tooltip="true"
              />
              <!-- <el-table-column prop="schemeName" label="预案名称" width="100">
                <template slot-scope="scope">
                  <span
                    v-for="item in manufacturerTypeOptions"
                    :key="item.value"
                    >{{
                      item.value.toLowerCase() ===
                      scope.row.manufacturer.toLowerCase()
                        ? item.label
                        : ''
                    }}</span
                  >
                </template>
              </el-table-column> -->
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
            </el-table>
            <pagination
              :pages-data="params"
              @size-change="sizeChange"
              @current-change="currentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="btn-lists">
      <el-button @click="goback"
        ><svg-icon class="svg-btn" icon-class="back-svg" />返回</el-button
      >
      <el-button type="primary" @click="clickLast" class="step-btn"
        >上一步</el-button
      >
      <el-button type="primary" @click="clickNext" class="step-btn"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  getAlarmVideoAreaList,
  getAlarmSchemeChannel
} from '@/api/method/alarm'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import pagination from '@/components/Pagination/index.vue'
import LineFont from '@/components/LineFont'

import { getGroupDictLists } from '@/api/method/dictionary'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { pagination, leftTree, LineFont },
  data() {
    return {
      // isShowStep2:false,
      templateName: '',
      areaNames: 'resourceName',
      treeList: [],
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
      searchParams: {
        deviceName: '',
        channelName: '',
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
      dialogTableData: [],
      tableData: [],
      selectedObj: {},
      selectedData: [],
      resIds2: [],
      allList: [],
      areaNames: 'resourceName',
      dialogResourceValue: '',
      resId: '',
      priChannelIds: []
    }
  },
  created() {
    this.priChannelIds = Local.get('priChannelIds') || []
  },
  mounted() {
    this.initTree()
  },
  methods: {
    async initTree() {
      await getAlarmVideoAreaList()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList = [res.data.data]
            this.resId = res.data.data.id ? res.data.data.id : ''
            this.$refs.deviceTree.chooseId(this.resId)
            this.initList(this.resId)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async initList(id) {
      let params = {}
      if (this.priChannelIds.length > 0) {
        params = {
          num: this.params.pageSize,
          page: this.params.pageNum,
          priChannelIds: this.priChannelIds,
          videoAreaId: id,
          includeEquipment: this.includeEquipment ? 1 : 0,
          ...this.searchParams
        }
      } else {
        params = {
          num: this.params.pageSize,
          page: this.params.pageNum,
          videoAreaId: id,
          includeEquipment: this.includeEquipment ? 1 : 0,
          ...this.searchParams
        }
      }
      await getAlarmSchemeChannel({
        ...params
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.records
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.current
            this.tableLoading = false

            this.tableData.map((item) => {
              if (Object.keys(Local.get('detailsData')).length > 0) {
                this.allList = Local.get('detailsData').channelIdList

                this.allList.map((item1) => {
                  if (Number(item1) === item.channelId) {
                    this.selectedObj[item1] = item
                  }
                })
              }
            })

            this.handleRowSelection(this.tableData)
          } else {
            this.tableLoading = false
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    childClickHandle(data) {
      this.dialogResourceValue = data.resourceValue
      this.resId = data.id
      this.initList(data.id)
    },
    handleSelectChange(selection) {
      // 全选取消，删除当前页所有数据
      if (selection.length === 0) {
        this.tableData.forEach((item) => {
          delete this.selectedObj[item.channelId]
        })
        this.tableData.forEach((item) => {
          // console.log('~~~~~~~~~~~~~~', item)
          this.allList = this.allList.filter((item1) => {
            return item1 !== item.channelId
          })
        })
      }
      // 勾选数据 添加
      selection.forEach((item) => {
        this.selectedObj[item.channelId] = item
      })
      // 获取所有分页勾选的数据
      this.selectedData = []
      for (const key in this.selectedObj) {
        this.selectedData.push(this.selectedObj[key])
      }
    },
    handleSelect(selection, row) {
      // 取消单个勾选时，删除对应属性
      if (!selection.some((item) => item.channelId === row.channelId)) {
        delete this.selectedObj[row.channelId]
        this.allList = this.allList.filter((item1) => {
          return item1 !== row.channelId
        })
      } else {
        this.allList.push(row.channelId)
      }
    },
    // 处理当前列表选中状态
    handleRowSelection(data) {
      console.log('处理当前列表选中状态', data, this.selectedObj)
      data.forEach((item) => {
        if (this.selectedObj[item.channelId]) {
          this.$nextTick(() => {
            this.$refs.timeTemTable2.toggleRowSelection(item)
            this.$forceUpdate()
          })
        }
      })
    },

    async getAllGatewayLists() {
      await getAllGatewayLists().then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.name
            obj.value = item.id
            obj.protocol = item.protocol
            this.allNorthTypeOptions.push(obj)
          })
        }
      })
    },
    clickLast() {
      this.$emit('last')
    },
    clickNext() {
      this.resIds2 = []
      console.log('this.selectedData', this.selectedData)
      this.selectedData.map((item) => {
        this.resIds2.push(item.channelId)
      })
      this.$emit('stepParams2', this.resIds2)
      this.$emit('next')
    },
    goback() {
      this.$emit('goback')
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
    changeOrganization() {
      this.initList(this.resId)
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.initList(this.resId)
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.initList(this.resId)
    },
    deploymentData() {
      this.dialogShow1 = true
    },
    resetData(e) {
      this.searchParams = {
        deviceName: '',
        channelName: '',
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
      this.initList(this.resId)
    },
    cxData() {
      this.initList(this.resId)
    }
  }
}
</script>

<style lang="scss" scoped>
.step1-content {
  height: 100%;
  overflow: hidden;
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
        height: calc(100% - 75px);
        .pane-content {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .btn-lists {
    position: relative;
    bottom: 0;
    width: 100%;
    text-align: right;
    padding-right: 24px;
    height: 64px;
    line-height: 64px;
    background: #ffffff;
    box-shadow: 0px -2px 4px 1px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 0px;
    .svg-btn {
      position: relative;
      top: 1px;
      left: -4px;
    }
    .step-btn {
      height: 36px;
      position: relative;
      top: -1px;
    }
  }
}
::v-deep .el-table::before {
  height: 0 !important;
}
::v-deep .el-table--border {
  border-bottom: 1px solid #eaeaea;
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
  // height: 100% !important;
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
    // min-height: 80px;
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
      height: calc(100% - 145px);
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
}
</style>
