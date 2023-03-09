<template>
  <div class="menuManagement_container">
    <div class="panel-header-box">
      <div class="panel-header-box-border">菜单管理</div>
    </div>

    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="120px"
      >
        <el-form-item label="菜单名称:">
          <el-input
            v-model="searchParams.menuName"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="跳转URL:">
          <el-input
            v-model="searchParams.url"
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
            ><svg-icon class="svg-btn" icon-class="add" /><span class="btn-span"
              >新建</span
            ></el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        row-key="id"
        class="menuManagement-table"
        height="700"
        :tree-props="{ children: 'children' }"
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
      >
        <el-table-column prop="icon" width="50" align="center" label="图标">
          <template slot-scope="scope">
            <svg-icon
              slot="suffix"
              :icon-class="scope.row.icon"
              class="menus-icon"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="菜单名称" />
        <el-table-column prop="path" label="跳转URL" width="180" />
        <el-table-column prop="menuSort" label="排序" width="80" />
        <el-table-column prop="component" label="前端组件Import路径" />
        <el-table-column prop="status" label="是否禁用" width="100">
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
        <el-table-column prop="hidden" label="是否隐藏" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.hidden"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @change="changeSwitchHidden(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作" fixed="right">
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
    </div>

    <el-dialog
      :title="dialogForm.title1"
      :visible.sync="dialogForm.show"
      width="650px"
    >
      <div>
        <el-form
          ref="roleForm"
          class="params-form"
          size="mini"
          label-width="120px"
          :rules="rules"
          label-position="right"
          :model="dialogForm.params"
          @keyup.enter="submit('roleForm')"
        >
          <el-form-item label="所属应用：" prop="appId">
            <el-select
              v-model="dialogForm.params.appId"
              placeholder="请选择"
              style="width: 436px"
              @change="changeApplication"
            >
              <el-option
                v-for="o in applicationOption"
                :label="o.label"
                :value="o.value"
                :key="o.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上级菜单：" v-if="isDisabled" prop="menuPid">
            <el-select
              ref="selectTree"
              v-model="dialogForm.params.menuPid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 436px"
              class="selectTree"
              disabled
              id="selectTree"
            >
              <el-option :value="List">
                <el-tree
                  ref="tree"
                  class="unit-tree"
                  :data="treeList"
                  node-key="id"
                  :props="defaultProps"
                  :default-expanded-keys="Ids"
                  highlight-current
                  :expand-on-click-node="false"
                  @node-click="nodeClickHandle"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级菜单：" v-else prop="menuPid">
            <el-select
              ref="selectTree"
              v-model="dialogForm.params.menuPid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 436px"
              class="selectTree"
              id="selectTree"
            >
              <el-option :value="List">
                <el-tree
                  ref="tree"
                  class="unit-tree"
                  :data="treeList"
                  node-key="id"
                  :props="defaultProps"
                  :default-expanded-keys="Ids"
                  highlight-current
                  :expand-on-click-node="false"
                  @node-click="nodeClickHandle"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称：" prop="title">
            <el-input v-model="dialogForm.params.title" style="width: 436px" />
          </el-form-item>
          <el-form-item label="菜单图标：" prop="icon">
            <el-input v-model="dialogForm.params.icon" style="width: 436px" />
          </el-form-item>
          <el-form-item label="排序：" prop="menuSort">
            <el-input
              v-model="dialogForm.params.menuSort"
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="跳转URL：">
            <el-input v-model="dialogForm.params.path" style="width: 436px" />
          </el-form-item>
          <el-form-item label="前端组件路径：">
            <el-input
              v-model="dialogForm.params.component"
              style="width: 436px"
            />
          </el-form-item>
          <el-form-item label="是否禁用：">
            <el-radio-group v-model="dialogForm.params.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否隐藏：">
            <el-radio-group v-model="dialogForm.params.hidden">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addMenuInfo,
  editMenuInfo,
  getMenuInfoLists,
  deleteMenuInfo,
  getApplicationList,
  getApplicationTree
} from '@/api/method/menus'
import { changeRoleStatus, changeRoleHidden } from '@/api/method/role'
import pagination from '@/components/Pagination/index.vue'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
      tableData: [],
      isDisabled: true,
      dialogForm: {
        show: false,
        title1: '新建',
        params: {
          component: '',
          path: '',
          status: '',
          hidden: '',
          menuSort: '',
          title: '',
          icon: '',
          appId: '',
          menuPid: ''
        }
      },
      searchParams: {
        menuName: '',
        url: ''
      },
      rules: {
        menuPid: [{ required: true, message: '请选择', trigger: 'change' }],
        appId: [{ required: true, message: '请选择', trigger: 'change' }],
        ip: [{ required: true, message: '请填写ip', trigger: 'change' }],
        icon: [{ required: true, message: '请填写图标', trigger: 'change' }],
        title: [{ required: true, message: '请填写名称', trigger: 'change' }]
      },
      treeData: [],
      editId: '',
      applicationOption: [],
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    cxData() {
      this.getList()
    },
    resetData() {
      this.searchParams = {
        menuName: '',
        url: ''
      }
    },
    nodeClickHandle(data) {
      this.dialogForm.params.menuPid = data.title
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    changeSwitch(row) {
      let text = row.status === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.title + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          changeRoleStatus({
            id: row.id,
            status: row.status
          }).then((res) => {})
        })
        .catch(() => {
          row.status = row.status === 0 ? 1 : 0
        })
    },
    changeSwitchHidden(row) {
      let text = row.hidden === 0 ? '显示' : '隐藏'

      this.$confirm('确认要"' + text + '""' + row.title + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          changeRoleHidden({
            id: row.id,
            hidden: row.hidden
          }).then((res) => {})
        })
        .catch(() => {
          row.hidden = row.hidden === 0 ? 1 : 0
        })
    },
    changeApplication(val) {
      this.isDisabled = false
      getApplicationTree({ appId: val }).then((res) => {
        if (res.code === 0) {
          this.treeList = res.data
        }
      })
    },
    dialogShow(type, row) {
      this.applicationOption = []
      this.isDisabled = true
      getApplicationList().then((res) => {
        if (res.code === 0) {
          res.data.map((item) => {
            let obj = {}
            obj.label = item.appName
            obj.value = item.id
            this.applicationOption.push(obj)
          })
        }
      })
      if (type === 0) {
        const {
          component,
          path,
          status,
          hidden,
          menuSort,
          title,
          icon,
          appId,
          menuPid
        } = row
        this.dialogForm.params.icon = icon
        this.dialogForm.params.title = title
        this.dialogForm.params.hidden = hidden
        this.dialogForm.params.status = status
        this.dialogForm.params.menuSort = menuSort
        this.dialogForm.params.path = path
        this.dialogForm.params.component = component
        this.dialogForm.params.appId = appId
        this.dialogForm.params.menuPid = menuPid

        this.editId = row.id
      } else {
        this.dialogForm.params = {
          component: '',
          path: '',
          status: '',
          hidden: '',
          menuSort: '',
          title: '',
          icon: '',
          appId: '',
          menuPid: ''
        }
      }
      this.dialogForm.title1 = type === 1 ? '新建' : '编辑'
      this.dialogForm.show = !this.dialogForm.show
    },
    async getList() {
      await getMenuInfoLists({
        ...this.searchParams
      }).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data
        }
      })
    },
    deleteRole(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenuInfo(row.id).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          }
        })
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialogForm.title1) {
            case '新建':
              this.dialogForm.params.menuPid = this.Id
              addMenuInfo(this.dialogForm.params).then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新建成功'
                  })
                  this.dialogForm.show = false
                  this.getList()
                }
              })
              break
            case '编辑':
              editMenuInfo({ id: this.editId, ...this.dialogForm.params }).then(
                (res) => {
                  if (res.code === 0) {
                    this.$message.success('编辑成功')
                    this.dialogForm.show = false
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
::v-deep .el-table .el-table__body-rapper {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}

::v-deep .menuManagement-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .menuManagement-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .menuManagement-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .menuManagement-table::-webkit-scrollbar-corner {
  background-color: #111;
}

// 滚动条大小设置
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .el-table__body-wrapper::-webkit-scrollbar-corner {
  background-color: #111;
}

// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}

::v-deep .el-table__expand-icon {
  position: relative;
  top: 5px;
  width: 16px;
  height: 16px;
}
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}
.menuManagement_container {
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
  .params-form {
    .el-input,
    .el-select {
      width: 100%;
      margin-right: 30px;
    }
  }
  .menus-icon {
    width: 16px;
    height: 16px;
    position: relative;
    top: -10px;
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
    .menuManagement-table {
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
