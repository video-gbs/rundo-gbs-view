<template>
  <div class="applicationManagement_container">
    <div class="panel-header-box">
      <div class="panel-header-box-border">应用管理</div>
    </div>

    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="120px"
      >
        <el-form-item label="应用名称:">
          <el-input
            v-model="searchParams.appName"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在IP:">
          <el-input
            v-model="searchParams.appIp"
            placeholder="请输入"
            clearable
            style="width: 240px"
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
    <div class="table-list">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button type="primary" @click="dialogShow(1)"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新建</span></el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="applicationManagement-table"
        border
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
      >
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column prop="appName" label="应用名称" />
        <el-table-column prop="appIp" label="应用所在IP" />
        <el-table-column prop="appPort" label="应用服务端口" />
        <el-table-column prop="appDesc" label="应用简介" />
        <el-table-column prop="status" label="是否禁用">
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
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
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
      width="600px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="roleForm"
          class="params-form"
          size="mini"
          :rules="rules"
          label-position="right"
          label-width="120px"
          :model="dialog.params"
          @keyup.enter="submit('roleForm')"
        >
          <el-form-item label="应用分类" prop="appType">
            <el-select v-model="dialog.params.appType" placeholder="请选择">
              <el-option
                v-for="o in appTypeOptions"
                :label="o.label"
                :value="o.value"
                :key="o.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="dialog.params.appName" clearable />
          </el-form-item>
          <el-form-item label="应用所在IP" prop="appIp">
            <el-input v-model="dialog.params.appIp" clearable />
          </el-form-item>
          <el-form-item label="应用服务端口" prop="appPort">
            <el-input v-model="dialog.params.appPort" clearable />
          </el-form-item>

          <el-form-item label="图标" prop="icon">
            <el-input v-model="dialog.params.icon" clearable />
          </el-form-item>
          <el-form-item label="URL" prop="appUrl">
            <el-input v-model="dialog.params.appUrl" clearable />
          </el-form-item>
          <el-form-item label="应用简介" prop="appDesc">
            <el-input
              v-model="dialog.params.appDesc"
              type="textarea"
              :rows="2"
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-row>
              <el-col>
                <el-radio v-model="dialog.params.status" :label="0"
                  >启用</el-radio
                >
                <el-radio v-model="dialog.params.status" :label="1"
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
  getAddApplicationList,
  addApplication,
  getAddApplicationById,
  deleteApplication,
  editApplication,
  changeStatus
} from '@/api/method/user'
import pagination from '@/components/Pagination/index.vue'

import { getManufacturerDictionaryList } from '@/api/method/dictionary'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
      appTypeOptions: [],
      switchValue: true,
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
        title: '新建',
        params: {
          appPort: '',
          appName: '',
          status: 1,
          appIp: '',
          appDesc: ''
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
        appIp: '',
        appName: ''
      },
      rules: {
        appName: {
          required: true,
          max: 32,
          min: 1,
          message: `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          pattern: /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/,
          trigger: 'blur'
        },
        appType: [
          { required: true, message: '此为必填项。', trigger: 'change' }
        ],
        appDesc: {
          message: '支持最大长度128个字符。',
          trigger: 'blur',
          max: 128
        },
        appPort: {
          message: '此为数字。',
          pattern: /^[0-9]*$/,
          trigger: 'blur'
        },
        appIp: [{ message: '此为必填项。', trigger: 'blur' }]
      },
      roleId: '',
      checkList: [],
      buttonLoading: false,
      treeData: []
    }
  },
  mounted() {
    this.getList()
    this.getManufacturerDictionaryList()
  },
  methods: {
    init() {
      getSysOrgTree({ id: 1 }).then((res) => {
        if (res.code === 0) {
          this.treeData = res.data
        }
      })
    },
    async getManufacturerDictionaryList() {
      await getManufacturerDictionaryList('AppTypes').then((res) => {
        if (res.code === 0) {
          res.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.appTypeOptions.push(obj)
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
    cxData() {
      this.getList()
    },
    resetData() {
      this.searchParams = {
        appIp: '',
        appName: ''
      }
    },
    changeSwitch(row) {
      let text = row.status === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.appName + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          changeStatus({
            id: row.id,
            status: row.status
          }).then((res) => {})
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0
        })
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
        const { appName, appPort, status, appDesc, appIp, appType, appIcon } =
          data
        this.dialog.params.appPort = appPort
        this.dialog.params.appName = appName
        this.dialog.params.appIp = appIp
        this.dialog.params.appDesc = appDesc
        this.dialog.params.appType = appType

        this.dialog.params.appIcon = appIcon
        this.dialog.params.status = Number(status)
        this.editId = data.id
      } else {
        this.dialog.params = {
          appPort: '',
          appName: '',
          status: 1,
          appIp: '',
          appDesc: '',
          appIcon: '',
          appType: ''
        }
      }
      this.dialog.title = act ? '新建' : '编辑'
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
      editApplication({
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
      getAddApplicationList({
        current: this.params.pageNum,
        pageSize: this.params.pageSize,
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
    deleteRole(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApplication(row.id).then((res) => {
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
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '新建':
              addApplication(this.dialog.params).then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新建成功'
                  })
                  this.dialog.show = false
                  this.getList()
                }
              })
              break
            case '编辑':
              editApplication({ id: this.editId, ...this.dialog.params }).then(
                (res) => {
                  if (res.code === 0) {
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
// 滚动条大小设置
::v-deep .applicationManagement-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .applicationManagement-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .applicationManagement-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .applicationManagement-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.applicationManagement_container {
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
    height: calc(100% - 210px);
    -webkit-box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    border-radius: 2px;
    .applicationManagement-table {
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
</style>
