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
        <el-form-item label="用户账号:">
          <el-input
            v-model="searchParams.userAccount"
            clearable
            :maxlength="15"
          />
        </el-form-item>
        <el-form-item label="用户姓名:">
          <el-input v-model="searchParams.userName" clearable :maxlength="15" />
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
            <span class="btn-span">查询</span></el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <div class="table-content-top">
        <el-checkbox v-model="checked" class="table-content-top-check"
          >包含下级组织</el-checkbox
        >
        <div class="btn-lists">
          <el-button @click="deteleAll($event)" style="width: 100px" plain
            ><svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">批量删除</span></el-button
          >
          <el-button type="primary" @click="addEquipment"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span></el-button
          >
        </div>
      </div>
      <el-table
        ref="encoderTable"
        class="table-content-bottom"
        :data="tableData1"
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
          prop="userAccount"
          label="用户账户"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="userName"
          label="用户姓名"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="orgName"
          label="所属部门"
          width="240"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="roleNameStr"
          label="角色"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="jobNo" label="用户工号" />
        <el-table-column prop="createdTime" label="创建时间" width="140" />
        <el-table-column prop="updatedTime" label="更新时间" width="140" />
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @change="changeSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editEquipment(scope.row)"
              >编辑
            </el-button>
            <el-button type="text" @click="deleteUser(scope.row)"
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

    <!-- <el-dialog title="移动位置" :visible.sync="dialogShow" width="30%">
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
        <leftTree :treeData="treeData" @childClickHandle="childClickHandle" />
      </div>

      <div class="dialog-footer">
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary"
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
        ref="encoderTable1"
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
          prop="coding"
          label="设备编码"
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
    </el-dialog> -->
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
import LineFont from '@/components/LineFont'

import {
  getUserLists,
  deteleUser,
  changeUserStatus,
  deteleAllUser
} from '@/api/method/user'

import { Local } from '@/utils/storage'

export default {
  name: '',
  components: { pagination, LineFont },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
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
        userName: '',
        userAccount: ''
      },
      query: {},
      optionsList: [
        {
          label: 'ces',
          value: 'ces'
        }
      ],
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
      ],
      tableData1: [],
      orgId: '',
      editRolesDetail: []
    }
  },
  created() {
    this.params.pageNum = Local.get('accountManagementPageNum')
    Local.remove('accountManagementPageNum')
  },
  mounted() {},
  methods: {
    getList(id) {
      getUserLists({
        current: this.params.pageNum,
        pageSize: this.params.pageSize,
        orgId: id ? id : this.orgId,
        ...this.searchParams
      }).then((res) => {
        if (res.code === 0) {
          this.tableData1 = res.data.records
          this.params.total = res.data.total
          this.params.pages = res.data.pages
          this.params.current = res.data.current
        }
      })
    },
    resetData(e) {
      this.searchParams = {
        userName: '',
        userAccount: ''
      }
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      }
      target.blur()
      this.params.pageNum = 1
      this.getList()
    },
    saveId(id) {
      this.orgId = id
    },
    deleteUser(row) {
      this.$confirm(`确定删除用户${row.userName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deteleUser(row.id).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList(this.orgId)
          }
        })
      })
    },
    deteleAll(e) {
      let target = e.target
      this.$confirm(
        `确定删除${
          this.$refs.encoderTable.selection.length > 0
            ? this.$refs.encoderTable.selection.length
            : 0
        }个用户？`,
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
        deteleAllUser(roleIds).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            if (target.nodeName === 'SPAN' || target.nodeName === 'use') {
              target = e.target.parentNode.parentNode
            }
            target.blur()
            this.params.pageNum = 1
            this.getList(this.orgId)
          }
        })
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
    synchronizationData() {
      this.$router.push(`/activeDiscovery/transfer`)
    },
    deploymentData() {
      this.dialogShow1 = true
    },
    cxData() {
      this.getList()
    },
    addEquipment() {
      this.$router.push(`/user`)
    },
    editEquipment(row) {
      Local.set('accountManagementPageNum', this.params.pageNum)
      this.$router.push({ path: '/editUser', query: { key: row.id } })
    },
    changeSwitch(row) {
      let text = row.status === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.userName + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          changeUserStatus({
            id: row.id,
            status: row.status
          }).then((res) => {})
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0
        })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .table-content-bottom .el-table__fixed-right {
  height: 100% !important;
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

::v-deep .el-dialog__body {
  padding-bottom: 0;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}

.encoder-content {
  height: 100%;
  .search {
    width: 100%;
    height: 80px;
    // line-height: 80px;
    margin-bottom: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      position: relative;
      top: 60%;
      transform: translate(0%, -50%);
    }
  }
  .table-content {
    height: calc(100% - 104px);
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 18px;
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
    .table-content-bottom {
      // padding: 0 18px;
      max-height: calc(100% - 90px);
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
::v-deep .el-table::before {
  height: 0;
}
</style>
