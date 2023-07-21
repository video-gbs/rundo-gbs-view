<template>
  <div
    class="role_container"
    v-if="!isClickedUserDiscovery && !isClickedCreatingRole && isShow"
  >
    <div class="panel-header-box">
      <div class="panel-header-box-border">角色管理</div>
    </div>

    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="120px"
      >
        <el-form-item label="角色名称:">
          <el-input
            v-model="searchParams.roleName"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建者:">
          <el-input
            v-model="searchParams.createBy"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
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
            <span class="btn-span">查询</span></el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <div class="table-content-top">
        <div class="btn-lists">
          <el-button
            v-permission="['/rbac/role/batch/delete', 4]"
            @click="deteleAll($event)"
            style="width: 100px"
            plain
            ><svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">批量删除</span>
          </el-button>
          <el-button
            v-permission="['/rbac/role/add', 2]"
            type="primary"
            @click="changeIsClicked('creatingRole', 1)"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新建</span></el-button
          >
        </div>
      </div>
      <el-table
        ref="roleTable"
        :data="tableData"
        style="width: 100%"
        class="role-table"
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
          prop="roleName"
          label="角色名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column
          prop="roleDesc"
          label="描述"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="disabled" label="启用状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-permission="['/rbac/role/update/disabled', 3]"
              v-model="scope.row.disabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @change="changeSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="['/rbac/role/associate', 2]"
              type="text"
              @click="changeIsClicked('userDiscovery', 1, scope.row)"
              >关联用户
            </el-button>
            <el-button
              v-permission="['/rbac/role/update', 3]"
              type="text"
              @click="changeIsClicked('creatingRole', 2, scope.row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['/rbac/role/batch/delete', 4]"
              type="text"
              @click="deleteRole(scope.row)"
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
  <CreatingRole
    v-else-if="isClickedCreatingRole"
    ref="creatingRole"
    :creatingRoleRow="creatingRoleRow"
    :nameType="nameType"
    @changeIsClicked="changeIsClicked"
    @getList="getList"
  />
  <UserDiscovery
    v-else-if="isClickedUserDiscovery"
    ref="userDiscovery"
    :userDiscoveryRow="userDiscoveryRow"
    @changeIsClicked="changeIsClicked"
    @getList="getList"
  />
</template>

<script>
import {
  getRoleLists,
  roleSearch,
  roleDisable,
  roleAdd,
  roleUpdate,
  roleDelete,
  roleAssociate
} from '@/api/method/role'
import pagination from '@/components/Pagination/index.vue'
import CreatingRole from '../../resourceManagement/components/CreatingRole.vue'
import UserDiscovery from '../../resourceManagement/components/UserDiscovery.vue'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { pagination, CreatingRole, UserDiscovery },
  data() {
    return {
      isShow: false,
      search: {
        userName: '',
        phone: '',
        time: ''
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      optionsList: [
        {
          label: 'ces',
          value: 'ces'
        }
      ],
      nameType: '',
      isClickedCreatingRole: false,
      isClickedUserDiscovery: false,
      creatingRoleRow: {},
      userDiscoveryRow: {},

      tableData: [],
      permissionTableData: [],
      searchParams: {
        createBy: '',
        roleName: '',
        time: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
          {
            min: 0,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'change'
          }
        ]
      },
      roleId: '',
      checkList: [],
      buttonLoading: false,
      treeData: []
    }
  },
  created() {
    this.params.pageNum = Local.get('rolePageNum')
    Local.remove('rolePageNum')
  },
  mounted() {
    this.getList()
  },
  methods: {
    changeSwitch(row) {
      let text = row.disabled === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.roleName + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          roleDisable({
            roleId: row.id,
            disabled: row.disabled
          }).then((res) => {})
        })
        .catch(function () {
          row.disabled = row.disabled === 0 ? 1 : 0
        })
    },
    changeIsClicked(name, val, row) {
      if (val === 1) {
        if (name === 'creatingRole') {
          this.nameType = 'add'
          this.isClickedCreatingRole = true
        } else {
          this.isClickedUserDiscovery = true
          this.userDiscoveryRow = row
        }
      } else {
        if (name === 'creatingRole') {
          this.nameType = 'edit'
          this.creatingRoleRow = row
          this.isClickedCreatingRole = true
        } else {
          this.isClickedCreatingRole = false
          this.isClickedUserDiscovery = false
        }
      }
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    resetData(e) {
      this.searchParams = {
        createBy: '',
        roleName: '',
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
    cxData() {
      this.getList()
    },
    goPage(path, query) {
      this.$router.push(path)
    },
    isShowChildren(data) {
      return data.find((res) => {
        return res.childs.length !== 0
      })
    },
    dialogShow(act, data) {
      if (act === 0) {
        const { name, detail, status } = data
        this.dialog.params.detail = detail
        this.dialog.params.name = name
        this.dialog.params.status = Number(status)
        this.editId = data.id
      }
      this.dialog.title = act ? '添加角色' : '编辑角色'
      this.dialog.show = !this.dialog.show
    },
    handleClose(done) {
      done()
    },
    permissionHandleClose(done) {
      done()
    },
    buildTree(v) {
      // v==get ,set
      this.checkList = []
      this.permissionTableData.forEach((i) => {
        if (i.childs && i.childs.length) {
          v === 'get' && i.hasAuthorize && this.checkList.push(i.id)
          i.childs.forEach((l) => {
            v === 'get' && l.hasAuthorize && this.checkList.push(l.id)
            if (l.childs && l.childs.length) {
              l.childs.forEach((m) => {
                v === 'get' && m.hasAuthorize && this.checkList.push(m.id)
              })
            }
          })
        }
      })
    },
    goActiveDiscovery(id) {
      Local.set('rolePageNum', this.params.pageNum)
      this.$router.push({ path: '/userDiscovery', query: { key: id } })
    },
    goEditRole(row) {
      Local.set('rolePageNum', this.params.pageNum)
      this.$router.push({
        path: '/creatingRole',
        query: { key: 'edit', row: row }
      })
    },
    goCreatingRole() {
      this.$router.push({ path: '/creatingRole', query: { key: 'add' } })
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
    getCkeckList() {},
    savePermission() {
      this.buttonLoading = true
      // this.checkList = []
      this.buildTree('get')
      roleAssociate({
        roleId: this.roleId,
        permissionIds: this.checkList
      }).then((res) => {
        this.buttonLoading = false
        if (res.data.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.permissionDialog.show = !this.permissionDialog.show
          // this.$router.go(-1)
        }
      })
    },
    async getList() {
      const createdTimeEnd = this.searchParams.time
        ? this.searchParams.time[1]
        : ''
      const createdTimeStart = this.searchParams.time
        ? this.searchParams.time[0]
        : ''
      const roleName = this.searchParams.roleName
      const createBy = this.searchParams.createBy
      await getRoleLists({
        page: this.params.pageNum,
        num: this.params.pageSize,
        roleName,
        createdTimeStart,
        createdTimeEnd,
        createBy
      }).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.params.total = res.data.data.total
          this.params.pages = res.data.data.pages
          this.params.current = res.data.data.current

          setTimeout(() => {
            this.isShow = true
          }, 100)
        }
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
      if (this.$refs.roleTable.selection.length === 0) {
        this.$message({
          message: '请勾选角色',
          type: 'warning'
        })
        return
      }
      this.$confirm(
        `确定删除${
          this.$refs.roleTable.selection.length > 0
            ? this.$refs.roleTable.selection.length
            : 0
        }个角色？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const roleIds = []
        // console.log('this.$refs.roleTable.selection',this.$refs)
        this.$refs.roleTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        roleDelete(roleIds).then((res) => {
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
      this.$confirm(`确定删除角色${row.roleName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleDelete(row.id).then((res) => {
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
::v-deep .el-dialog__header {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #eaeaea;
}
::v-deep .role-table .el-table__fixed-right {
  height: 100% !important;
}
::v-deep .el-table--enable-row-transition {
  height: 100% !important;
}
// 滚动条大小设置
::v-deep .role-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .role-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .role-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .role-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.role_container {
  width: 100%;
  height: calc(100% - 30px);
  // display: flex;
  // flex-direction: column;
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
    // height: 80px;
    min-height: 80px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      padding-top: 25px;
    }
  }

  .table-list {
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 18px;
    margin: 0 20px 20px 20px;
    height: calc(100% - 170px);
    .role-table {
      max-height: calc(100% - 80px);
      overflow-y: auto;
    }
    .table-content-top {
      .btn-lists {
        float: right;

        margin-bottom: 10px;
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

// ::v-deep .el-form-item__content {
//   // height: 28px;
//   display: flex;
//   align-items: center;
// }
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
</style>
