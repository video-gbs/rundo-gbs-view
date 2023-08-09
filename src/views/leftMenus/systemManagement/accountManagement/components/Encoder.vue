<template>
  <div class="encoder-content" v-if="isShow">
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="工作名称:">
          <el-input v-model="searchParams.workName" clearable :maxlength="15" />
        </el-form-item>
        <el-form-item label="用户姓名:">
          <el-input v-model="searchParams.username" clearable :maxlength="15" />
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
        <el-checkbox
          v-model="accountChecked"
          class="table-content-top-check"
          @change="changeAccountChecked"
          >包含下级组织</el-checkbox
        >
        <div class="btn-lists">
          <el-button
            v-permission="['/rbac/user/batch/delete', 4]"
            @click="deteleAll($event)"
            style="width: 100px"
            plain
            ><svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">批量删除</span></el-button
          >
          <el-button
            v-permission="['/rbac/user/add', 2]"
            type="primary"
            @click="addEquipment('add')"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span></el-button
          >
        </div>
      </div>
      <el-table
        ref="userTable"
        class="table-content-bottom"
        :data="userTableData"
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
          prop="workName"
          label="工作名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="username"
          label="用户姓名"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="workNum"
          label="工号"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="phone"
          label="手机号码"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="address"
          label="地址"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="description"
          label="描述"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="createTime" label="创建时间" width="140" />
        <el-table-column prop="updateTime" label="更新时间" width="140" />
        <el-table-column prop="disabled" label="启用状态" width="120">
          <template slot-scope="scope">
            <el-switch
              v-permission="['/rbac/user/update/disabled', 3]"
              v-model="scope.row.disabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @change="changeDisabledSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['/rbac/user/update', 2]"
              type="text"
              @click="editEquipment('edit', scope.row)"
              >编辑
            </el-button>

            <el-button
              v-permission="['/rbac/user/batch/delete', 4]"
              type="text"
              @click="deleteUser(scope.row)"
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
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'

import {
  getUserList,
  userAdd,
  userUpdate,
  userDelete,
  userUpdateDisabled
} from '@/api/method/user'

import { Local } from '@/utils/storage'

export default {
  name: '',
  components: { pagination },
  data() {
    return {
      isShow: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      resName: '',
      searchParams: {
        username: '',
        workName: ''
      },
      accountChecked: true,
      userTableData: [],
      newUserId: ''
    }
  },
  created() {
    this.params.pageNum = Local.get('accountManagementPageNum')
    Local.remove('accountManagementPageNum')
  },

  mounted() {},
  methods: {
    async getList(id) {
      await getUserList({
        page: this.params.pageNum,
        num: this.params.pageSize,
        sectionId: id ? id : this.newUserId,
        isInclude: this.accountChecked,
        ...this.searchParams
      }).then((res) => {
        if (res.data.code === 0) {
          this.newUserId = id
          this.userTableData = res.data.data.list
          this.params.total = res.data.data.total
          this.params.pages = res.data.data.pageNum
          this.params.current = res.data.data.pageSize

          setTimeout(() => {
            this.isShow = true
          }, 100)
        } else {
          this.$message({
            type: 'warning',
            message: res.data.data
          })
          this.userTableData = []
        }
      })
    },
    changeAccountChecked(val) {
      this.getList(this.newUserId)
    },
    // 回显树名字
    getTreeName(arr, id) {
      arr.map((item) => {
        if (item.id === id) {
          this.resName = item.name
          this.Id = id
          return
        } else {
          if (item.childList && item.childList.length > 0) {
            this.getTreeName(item.childList, id)
          }
        }
      })
    },
    resetData(e) {
      this.searchParams = {
        username: '',
        workName: ''
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

      this.getList('0')
    },
    saveId(id) {
      this.newUserId = id
    },
    deleteUser(row) {
      this.$confirm(`确定删除用户${row.username}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDelete(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList(this.newUserId)
          }
        })
      })
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
      if (this.$refs.userTable.selection.length === 0) {
        this.$message({
          message: '请勾选用户',
          type: 'warning'
        })
        return
      }
      this.$confirm(
        `确定删除${
          this.$refs.userTable.selection.length > 0
            ? this.$refs.userTable.selection.length
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
        // console.log('this.$refs.userTable.selection',this.$refs)
        this.$refs.userTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        userDelete(roleIds).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList(this.newUserId)
          }
        })
      })
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList(this.newUserId)
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList(this.newUserId)
    },
    synchronizationData() {
      this.$router.push(`/activeDiscovery/transfer`)
    },
    deploymentData() {
      this.dialogShow1 = true
    },
    cxData() {
      this.getList(this.newUserId)
    },
    addEquipment(name) {
      this.$emit('changeIsShow', true, name, {})
      // this.$router.push(`/user`)
    },
    editEquipment(name, row) {
      Local.set('accountManagementPageNum', this.params.pageNum)
      this.$emit('changeIsShow', true, name, row)
    },
    changeDisabledSwitch(row) {
      let text = row.disabled === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.username + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          userUpdateDisabled({
            userId: row.id,
            disabled: row.disabled
          }).then((res) => {})
        })
        .catch(function () {
          row.disabled = row.disabled === 0 ? 1 : 0
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
::v-deep .table-content-bottom .el-table__fixed-right {
  height: 100% !important;
}
::v-deep .el-table--enable-row-transition {
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

.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
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
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
</style>
