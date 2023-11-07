<template>
  <div class="dataDictionary_container" v-if="isShow">
    <div
      v-show="!isAddAlarmPlanShow && !isEditAlarmPlanShow"
      style="height: 100%"
    >
      <div class="panel-header-box">
        <div class="panel-header-box-border">告警预案</div>
      </div>

      <div class="search">
        <el-form
          ref="query"
          class="search-form"
          :inline="true"
          :model="searchParams"
          label-width="120px"
        >
          <el-form-item label="预案名称:">
            <el-input
              v-model="searchParams.schemeName"
              placeholder="请输入"
              clearable
              style="width: 240px"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select
              v-model="searchParams.disabled"
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

          <el-form-item label="创建日期:">
            <el-date-picker
              v-model="searchParams.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
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
      <div class="table-list">
        <div class="securityArea_container">
          <div class="btn-lists">
            <el-button v-permission="['/alarm-manage/scheme/add', 2]" type="primary" @click="dialogShow(1)"
              ><svg-icon class="svg-btn" icon-class="add" /><span
                class="btn-span"
                >新建</span
              ></el-button
            >
            <el-button v-permission="['/alarm-manage/scheme/delete', 4]" @click="deteleAll($event)" style="width: 100px" plain>
              <svg-icon class="svg-btn" icon-class="del" />
              <span class="btn-span">批量删除</span>
            </el-button>
          </div>
        </div>
        <el-table
          ref="timeTemTable"
          :data="tableData"
          style="width: 100%"
          class="dataDictionary-table"
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
          <el-table-column prop="schemeName" label="预案名称" />
          <el-table-column prop="eventNameList" label="告警事件" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="updateTime" label="修改时间" />
          <el-table-column
            prop="onStatus"
            label="状态"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-switch
                v-permission="['/alarm-manage/scheme/update/disabled', 3]"
                v-model="scope.row.disabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="changeSwitch(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column width="200" label="操作">
            <template slot-scope="scope">
              <el-button v-permission="['/alarm-manage/scheme/channel/defense', 3]" type="text" @click="dialogShowPassage(scope.row)"
                >布防通道</el-button
              >
              <el-button v-permission="['/alarm-manage/scheme/update', 3]" type="text" @click="dialogShow(0, scope.row)"
                >编辑</el-button
              >
              <el-button v-permission="['/alarm-manage/scheme/delete', 4]" type="text" @click="deleteRole(scope.row)"
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
      <el-dialog
        v-if="dialog.show"
        :title="dialog.title"
        :visible.sync="dialog.show"
        width="1200px"
        :before-close="handleClose"
      >
        <div>
          <div class="table-list" style="margin: 0px">
            <div class="securityArea_container">
              <div class="btn-lists" style="float: right">
                <el-button
                  type="primary"
                  style="width: 100px; margin-bottom: 10px"
                  @click="defenceAll"
                  >批量布防</el-button
                >
              </div>
            </div>
            <el-table
              ref="passageTableData"
              :data="passageTableData"
              style="width: 100%"
              class="dataDictionary-table"
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
              <el-table-column prop="channelName" label="通道名称" />
              <el-table-column prop="channelId" label="通道编号" />
              <el-table-column prop="deployState" label="布防状态" width="80">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.deployState === 1"
                    style="margin-left: 10px; color: #1fad8c"
                    >成功</span
                  >
                  <span
                    v-else
                    style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
                    >失败</span
                  >
                </template>
              </el-table-column>
              <el-table-column width="200" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="defence(scope.row)"
                    >布防</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :pages-data="params1"
              @size-change="sizeChange1"
              @current-change="currentChange1"
            />
          </div>
        </div>
      </el-dialog>
    </div>

    <AddAlarmPlan
      v-if="isAddAlarmPlanShow"
      @changeIsShow="changeIsShow"
      @getList="getList"
    />

    <EditAlarmPlan
      v-if="isEditAlarmPlanShow"
      @changeEditIsShow="changeEditIsShow"
      :detailsData="detailsData"
      :editAlarmId="editAlarmId"
      :priChannelIds="priChannelIds"
      @getList="getList"
    />
  </div>
</template>

<script>
import {
  getSchemeAlarmEventLists,
  editSchemeAlarmEventDisabled,
  getAlarmDeployChannel,
  getSchemeAlarmEventDefense,
  getSchemeAlarmEventDetails,
  deleteSchemeAlarmEvent
} from '@/api/method/alarm'
import pagination from '@/components/Pagination/index.vue'
import AddAlarmPlan from './components/AddAlarmPlan.vue'
import EditAlarmPlan from './components/EditAlarmPlan.vue'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { pagination, AddAlarmPlan, EditAlarmPlan },
  data() {
    return {
      isAddAlarmPlanShow: false,
      isEditAlarmPlanShow: false,
      disabledOptionsList: [],
      isShow: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      params1: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      selectedObj: {},
      selectedData: [],
      allList: [],
      resIds: [],
      permissionTableData: [],
      dialog: {
        show: false,
        title: '布防通道'
      },
      permissionDialog: {
        show: false,
        title: '编辑权限',
        params: {
          detail: '',
          name: '',
          status: 1
        }
      },
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
      searchParams: {
        schemeName: '',
        disabled: '',
        time: ''
      },
      passageTableData: [],
      roleId: '',
      checkList: [],
      buttonLoading: false,
      treeData: [],
      detailsData: [],
      editAlarmId: '',
      priChannelIds: ''
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    sizeChange1(pageSize) {
      this.params.pageSize = pageSize
      this.getChanneList()
    },
    currentChange1(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    cxData() {
      this.getList()
    },

    resetData(e) {
      this.searchParams = {
        schemeName: '',
        disabled: '',
        time: ''
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
      this.getList()
    },
    goPage(path, query) {
      this.$router.push(path)
    },
    changeSwitch(row) {
      console.log(row)
      let text = row.disabled === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.schemeName + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          editSchemeAlarmEventDisabled({
            id: row.id,
            disabled: row.disabled
          }).then((res) => {
            if (res.data.code !== 0) {
              row.disabled = row.disabled === 0 ? 1 : 0
            }
          })
        })
        .catch(function () {
          row.disabled = row.disabled === 0 ? 1 : 0
        })
    },
    isShowChildren(data) {
      return data.find((res) => {
        return res.childs.length !== 0
      })
    },
    dialogShowPassage(row) {
      getAlarmDeployChannel({
        num: this.params1.pageSize,
        page: this.params1.pageNum,
        schemeId: row.id
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.passageTableData = res.data.data.list
            this.params1.total = res.data.data.total
            this.params1.pages = res.data.data.pages
            this.params1.current = res.data.data.pageSize
            this.handleRowSelection(this.passageTableData)
          }
        })
        .catch(() => {})
      this.dialog.show = !this.dialog.show
    },
    defenceAll() {
      this.resIds = []
      this.selectedData.map((item) => {
        this.resIds.push(item.channelId)
      })
      getSchemeAlarmEventDefense({
        channelIds: this.resIds
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: '布防成功！',
              type: 'success'
            })
          }
        })
        .catch(() => {})
    },
    defence(row) {
      getSchemeAlarmEventDefense({
        channelIds: [row.channelId]
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: '布防成功！',
              type: 'success'
            })
          }
        })
        .catch(() => {})
    },

    handleSelectChange(selection) {
      // 全选取消，删除当前页所有数据
      if (selection.length === 0) {
        this.passageTableData.forEach((item) => {
          delete this.selectedObj[item.channelId]
        })
        this.passageTableData.forEach((item) => {
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
            this.$refs.passageTableData.toggleRowSelection(item)
            this.$forceUpdate()
          })
        }
      })
    },
    dialogShow(act, data) {
      if (act === 0) {
        getSchemeAlarmEventDetails(data.id).then((res) => {
          if (res.data.code === 0) {
            this.detailsData = res.data.data
            this.editAlarmId = data.id
            this.priChannelIds = res.data.data.channelIdList
            Local.set('editAlarmId', this.editAlarmId)
            Local.set('detailsData', this.detailsData)
            Local.set('priChannelIds', this.priChannelIds)
            setTimeout(() => {
              this.isEditAlarmPlanShow = true
            }, 500)
          }
        })
      } else {
        Local.set('detailsData', [])
        this.isAddAlarmPlanShow = true
      }
    },
    changeIsShow(val) {
      this.isAddAlarmPlanShow = val
    },
    changeEditIsShow(val) {
      this.isEditAlarmPlanShow = val
    },
    handleClose(done) {
      done()
    },
    getPermissionTableData(id) {
      this.permissionDialog.show = !this.permissionDialog.show
      this.roleId = id
      permissionTree(id).then((res) => {
        if (res.data.code === 0) {
          this.permissionTableData = res.data
        }
      })
    },
    checkMenu(list) {
      list.forEach((item) => {
        if (item.permissionType === 1) {
          item.ifPublic = this.checkList.indexOf(String(item.id)) !== -1
        } else {
          item.children && this.checkMenu(item.children)
        }
      })
    },
    async getList() {
      const createStartTime = this.searchParams.time
        ? this.searchParams.time[0]
        : ''
      const createEndTime = this.searchParams.time
        ? this.searchParams.time[1]
        : ''
      await getSchemeAlarmEventLists({
        num: this.params.pageSize,
        page: this.params.pageNum,
        schemeName: this.searchParams.schemeName,
        disabled: this.searchParams.disabled,
        createStartTime,
        createEndTime
      })
        .then((res) => {
          if (res && res.data.code === 0) {
            this.tableData = res.data.data.list
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.pageSize
            setTimeout(() => {
              this.isShow = true
            }, 500)
          }
        })
        .catch((error) => console.log(error))
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
      this.$confirm('删除后数据无法恢复，是否确认全部删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const roleIds = []
        this.$refs.timeTemTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        console.log(roleIds)
        // return
        deleteSchemeAlarmEvent(roleIds).then((res) => {
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
    deleteRole(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSchemeAlarmEvent([row.id]).then((res) => {
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
::v-deep .el-dialog__header {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #eaeaea;
}

::v-deep .dataDictionary-table .el-table__fixed-right {
  height: 100% !important;
}
// ::v-deep .el-table--enable-row-transition {
//   height: 100% !important;
// }
// ::v-deep .el-table::before {
//   height: 0;
// }
// 滚动条大小设置
::v-deep .dataDictionary-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.dataDictionary_container {
  width: 100%;
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

  .search {
    width: calc(100% - 40px);
    height: 80px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      position: relative;
      top: 60%;
      transform: translate(0%, -50%);
    }
  }
  .table-list {
    margin: 20px;
    padding: 20px;
    background: #ffffff;
    height: calc(100% - 195px);
    -webkit-box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    border-radius: 2px;
    .dataDictionary-table {
      height: calc(100% - 100px);
      overflow-y: auto;
    }
    .securityArea_container {
      margin-bottom: 20px;
      .btn-lists {
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
  }
}

.el-input {
  width: 100%;
}

.params-form {
  .el-input,
  .el-select {
    width: 100%;
    margin-right: 30px;
  }
}
.password-level-box {
  height: 28px !important;
  width: 100px;
  .password-level {
    height: 10px;
    width: 100px;

    > div {
      height: inherit;
      width: 33%;
      border: 1px solid #eee;
      margin-right: 5px;

      &:last-child {
        margin-right: 0px;
      }
    }
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
.delete-button {
  color: red !important;
}

.page-main {
  background: $mainBg;
  .main-operation {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $mainBg;
    .title {
      padding-left: 20px;
      position: relative;
    }
  }

  .main-content {
    background: #fff;
    .perms-tree {
      .tree-title {
        height: 56px;
        line-height: 56px;
        background: rgba(245, 245, 245, 0.39);
        display: flex;
        .title {
          width: 120px;
          font-size: 14px;
          text-align: center;
          &:last-child {
            flex: 1;
          }
        }
      }
      .tree-item {
        display: flex;
        .item-title {
          width: 120px;
          // height: 56px;
          line-height: 24px;
          font-size: 14px;
          text-align: center;
          padding: 12px;
          white-space: nowrap;
        }
        .item-children {
          flex: 1;
        }
      }
      .item-border {
        // border-bottom: 1px solid #CCCCCC;
        border-bottom: 1px solid #ebeef5;
      }
      .tree-operation {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        padding: 12px;
        display: flex;
        margin-left: 140px;
      }
      .tree-empty {
        line-height: 24px;
        padding: 12px;
        text-align: center;
        color: #909399;
      }
    }
  }
}
.perms-operation {
  margin-right: 20px;
}
.button-back {
  margin-right: 20px;
}
::v-deep .el-table::before {
  height: 0;
}
</style>
