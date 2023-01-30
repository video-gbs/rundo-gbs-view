<template>
  <div class="role_container">
    <div class="panel-header-box">
      <div>角色管理</div>
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
            v-model="searchParams.deptType"
            placeholder="请输入"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建者:">
          <el-input
            v-model="searchParams.status"
            placeholder="请输入"
            style="width: 240px"
          ></el-input>
        </el-form-item>

        <el-form-item label="创建日期:">
          <el-date-picker
            v-model="searchParams.name"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right; margin-right: 20px">
          <el-button
            ><svg-icon class="svg-btn" icon-class="cz" />重置</el-button
          >
          <el-button type="primary" @click="cxData"
            ><svg-icon class="svg-btn" icon-class="cx" />查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        style="width: 100%"
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
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="创建者" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column prop="detail" label="描述" />
        <el-table-column width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="getPermissionTableData(scope.row.id)"
              >关联用户
            </el-button>
            <el-button type="text" @click="dialogShow(0, scope.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteRole(scope.row)"
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
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="400px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="roleForm"
          class="params-form"
          size="mini"
          :rules="rules"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          @keyup.enter="submit('roleForm')"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="dialog.params.name" clearable :maxlength="15" />
          </el-form-item>
          <el-form-item label="角色说明">
            <el-input
              v-model="dialog.params.detail"
              type="textarea"
              :rows="2"
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item label="角色状态">
            <el-row>
              <el-col>
                <el-radio v-model="dialog.params.status" :label="1"
                  >启用</el-radio
                >
                <el-radio v-model="dialog.params.status" :label="0"
                  >禁用</el-radio
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('roleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="permissionDialog.title"
      :visible.sync="permissionDialog.show"
      width="1200px"
      :before-close="permissionHandleClose"
    >
      <div class="page-main">
        <div class="main-operation">
          <div class="title">
            <span>功能权限</span>
          </div>
          <div style="display: flex">
            <div class="perms-operation">
              <el-button
                type="primary"
                :loading="buttonLoading"
                @click="savePermission()"
                >保存设置</el-button
              >
            </div>
            <el-button
              class="button-back"
              @click="permissionDialog.show = false"
              >返回</el-button
            >
          </div>
        </div>
        <div class="main-content">
          <div class="perms-tree">
            <div class="tree-title">
              <div class="title">一级功能</div>
              <div class="title">二级功能</div>
              <div class="title">操作权限</div>
            </div>
            <div v-if="permissionTableData && permissionTableData.length > 0">
              <div
                v-for="item in permissionTableData"
                :key="item.id"
                class="tree-item item-border"
              >
                <div class="item-title">{{ item.title }}</div>
                <div class="item-children">
                  <template>
                    <div
                      v-for="child in item.childs"
                      :key="child.id"
                      class="tree-item"
                    >
                      <div class="item-title">{{ child.title }}</div>
                      <div class="tree-operation">
                        <template v-for="op in child.childs">
                          <el-checkbox :key="op.id" v-model="op.hasAuthorize">{{
                            op.title
                          }}</el-checkbox>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div v-else class="tree-empty item-border">暂无数据</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRoles,
  editRoles,
  deleteRoles,
  permissionTree,
  getRolesList,
  setAppAuth,
  getSysOrgTree
} from '@/api/method/role'
import pagination from '@/components/Pagination/index.vue'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
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
      tableData: [],
      permissionTableData: [],
      dialog: {
        show: false,
        title: '新增角色',
        params: {
          detail: '',
          name: '',
          status: 1
        }
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
      searchParams: {
        deptType: '',
        name: '',
        status: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 0,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      remove: deleteRoles,
      roleId: '',
      checkList: [],
      buttonLoading: false,
      treeData: []
    }
  },
  mounted() {
    this.getList()
    this.init()
  },
  methods: {
    init() {
      getSysOrgTree({ id: 1 }).then((res) => {
        if (res.code === 200) {
          this.treeData = res.data
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
    cxData() {
      this.$router.push(`/creatingRole/role`)
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
    getPermissionTableData(id) {
      this.permissionDialog.show = !this.permissionDialog.show
      this.roleId = id
      permissionTree(id).then((res) => {
        if (res.code === 10000) {
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
    getCkeckList() {},
    savePermission() {
      this.buttonLoading = true
      // this.checkList = []
      this.buildTree('get')
      setAppAuth({
        roleId: this.roleId,
        permissionIds: this.checkList
      }).then((res) => {
        this.buttonLoading = false
        if (res.code === 10000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.permissionDialog.show = !this.permissionDialog.show
          // this.$router.go(-1)
        }
      })
    },
    getList() {
      getRolesList({
        current: this.params.pageNum,
        size: this.params.pageSize
      }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.params.total = res.data.total
          this.params.pages = res.data.pages
          this.params.current = res.data.current
        }
      })
    },
    deleteRole(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(row.id).then((res) => {
          if (res.code === 10000) {
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
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '添加角色':
              addRoles(this.dialog.params).then((res) => {
                if (res.code === 10000) {
                  this.$message({
                    type: 'success',
                    message: '添加角色成功'
                  })
                  this.dialog.show = false
                  this.getList()
                }
              })
              break
            case '编辑角色':
              editRoles({ id: this.editId, ...this.dialog.params }).then(
                (res) => {
                  if (res.code === 10000) {
                    this.$message.success('编辑成功')
                    this.dialog.show = false
                    this.getList()
                  }
                }
              )
              break

            default:
              break
          }
        }
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
.role_container {
  width: 100%;
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
    border: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
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
