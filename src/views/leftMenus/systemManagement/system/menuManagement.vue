<template>
  <div class="menuManagement_container" v-if="isShow">
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
            v-model="searchParams.name"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="跳转URL:">
          <el-input
            v-model="searchParams.path"
            placeholder="请输入"
            clearable
            style="width: 240px"
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
    <div class="table-list">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button
            v-permission="['/rbac/menu/add', 2]"
            type="primary"
            @click="dialogShow(1)"
            ><svg-icon class="svg-btn" icon-class="add" /><span class="btn-span"
              >新建</span
            ></el-button
          >
        </div>
      </div>
      <el-table
        ref="menuTable"
        :data="tableData"
        border
        row-key="id"
        class="menuManagement-table"
        :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
      >
        <el-table-column prop="name" label="菜单名称">
          <template slot-scope="scope">
            <!-- <div> -->
            <svg-icon
              v-if="scope.row.menuType === 0"
              icon-class="xunimulu"
              class="tree1"
            />
            <svg-icon
              v-else-if="scope.row.menuType === 1"
              icon-class="mulu"
              class="tree1"
            />
            <svg-icon v-else icon-class="yemian" class="tree1" />

            <span>{{ scope.row.name }}</span>
            <!-- </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="path" label="跳转URL" width="180" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="component" label="前端组件Import路径" />
        <el-table-column prop="disabled" label="是否禁用" width="100">
          <template slot-scope="scope">
            <el-switch
              v-permission="['/rbac/menu/update/disabled', 3]"
              v-if="scope.row.id !== '0'"
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
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="['/rbac/menu/update', 3]"
              v-if="scope.row.id !== '0'"
              type="text"
              @click="dialogShow(0, scope.row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['/rbac/delete', 4]"
              v-if="scope.row.id !== '0'"
              type="text"
              @click="deleteRole(scope.row)"
              ><span class="delete-button">删除</span></el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-if="dialogForm.show"
      :title="dialogForm.title1"
      :visible.sync="dialogForm.show"
      width="650px"
    >
      <div>
        <el-form
          ref="roleForm"
          class="params-form"
          size="mini"
          label-width="130px"
          :rules="rules"
          label-position="right"
          :model="dialogForm.params"
          @keyup.enter="submit('roleForm')"
        >
          <el-form-item label="上级菜单：" prop="menuPid">
            <el-select
              ref="selectTree"
              v-model="dialogForm.params.menuPid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 436px"
              class="selectTree"
              id="selectTree"
            >
              <el-option :value="dialogForm.params.menuPid">
                <el-tree
                  ref="tree"
                  class="menu-tree tree"
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
          <el-form-item label="菜单名称：" prop="name">
            <el-input v-model="dialogForm.params.name" style="width: 436px" />
          </el-form-item>
          <el-form-item label="菜单图标：">
            <el-input v-model="dialogForm.params.icon" style="width: 436px" />
          </el-form-item>

          <el-form-item prop="menuType" label="菜单类型：">
            <el-select
              v-model="dialogForm.params.menuType"
              placeholder="请选择"
              style="width: 436px"
            >
              <el-option
                v-for="o in menuTypeeOptions"
                :label="o.label"
                :value="o.value"
                :key="o.value"
              />
            </el-select>
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
            <el-radio-group v-model="dialogForm.params.disabled">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示侧边栏：">
            <el-radio-group v-model="dialogForm.params.isFullScreen">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.show = false">取 消</el-button>
        <el-button type="primary" :loading="isClick" @click="submit('roleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMenuTree,
  menuAdd,
  menuUpdate,
  menuDelete,
  menuDisabled,
  menuHidden
} from '@/api/method/menus'
import pagination from '@/components/Pagination/index.vue'
import { getManufacturerDictionaryList } from '@/api/method/dictionary'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
      isShow: false,
      tableData: [],
      isClick: false,
      dialogForm: {
        show: false,
        title1: '新建',
        params: {
          menuSort: null,
          menuPid: '',
          menuType: '',
          path: '',
          component: '',
          name: '',
          icon: null,
          description: '',
          isFullScreen: 1,
          disabled: 1
        }
      },
      searchParams: {
        name: '',
        path: ''
      },
      rules: {
        menuPid: [{ required: true, message: '请选择', trigger: 'change' }],
        appId: [{ required: true, message: '请选择', trigger: 'change' }],
        ip: [{ required: true, message: '请填写ip', trigger: 'change' }],
        // icon: [{ required: true, message: '请填写图标', trigger: 'change' }],
        title: [{ required: true, message: '请填写名称', trigger: 'change' }]
      },
      treeData: [],
      editId: '',
      applicationOption: [],
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      menuTypeeOptions: [
        { label: '虚拟目录', value: 0 },
        { label: '目录', value: 1 },
        { label: '页面', value: 2 }
      ],
      resName: '',
      defaultProps: {
        children: 'childList',
        label: 'name'
      }
    }
  },
  created() {},
  mounted() {
    this.initGetMenuTree()
  },
  methods: {
    async initGetMenuTree() {
      await getMenuTree({
        ...this.searchParams
      }).then((res) => {
        if (res.data.code === 0) {
          this.tableData = [res.data.data]

          this.treeList = [res.data.data]

          setTimeout(() => {
            this.isShow = true
          }, 100)
        }
      })
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

    tableExpand(data, flag) {
      data.forEach((item) => {
        //用ref获取table表格，进行展开结构
        this.$refs.menuTable.toggleRowExpansion(item, flag)
        //如果存在children 并且长度大于0
        if (item.childList && item.childList.length > 0) {
          //递归进行展开结构
          this.tableExpand(item.childList, flag)
        } else {
          return
        }
      })
    },

    async getManufacturerDictionaryList() {
      await getManufacturerDictionaryList('MenuType').then((res) => {
        if (res.data.code === 0) {
          res.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.menuTypeeOptions.push(obj)
          })
        }
      })
    },
    cxData() {
      this.initGetMenuTree()
      this.tableExpand(this.tableData, true)
    },
    resetData(e) {
      this.searchParams = {
        name: '',
        path: ''
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
      this.initGetMenuTree()
    },
    nodeClickHandle(data) {
      this.dialogForm.params.menuPid = data.name
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    changeSwitch(row) {
      let text = row.disabled === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.name + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          menuDisabled({
            menuId: row.id,
            disabled: row.disabled
          }).then((res) => {})
        })
        .catch(() => {
          row.disabled = row.disabled === 0 ? 1 : 0
        })
    },
    // changeSwitchHidden(row) {
    //   let text = row.hidden === 0 ? '显示' : '隐藏'

    //   this.$confirm('确认要"' + text + '""' + row.name + '"吗?', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       menuHidden({
    //         menuId: row.id,
    //         hidden: row.hidden
    //       }).then((res) => {})
    //     })
    //     .catch(() => {
    //       row.hidden = row.hidden === 0 ? 1 : 0
    //     })
    // },
    dialogShow(type, row) {
      if (type === 0) {
        const {
          component,
          path,
          status,
          isFullScreen,
          sort,
          title,
          icon,
          appId,
          menuPid,
          name,
          menuType
        } = row
        this.dialogForm.params.icon = icon
        this.dialogForm.params.title = title
        this.dialogForm.params.isFullScreen = isFullScreen
        this.dialogForm.params.status = status
        this.dialogForm.params.menuSort = sort
        this.dialogForm.params.path = path
        this.dialogForm.params.component = component
        this.dialogForm.params.appId = appId
        this.dialogForm.params.menuType = menuType
        // this.dialogForm.params.menuPid = menuPid
        this.dialogForm.params.name = name
        this.editId = row.id

        // this.$nextTick(() => {
        this.getTreeName(this.treeList, menuPid)
        this.dialogForm.params.menuPid = this.resName
        // })
      } else {
        this.dialogForm.params = {
          menuSort: null,
          menuPid: '',
          menuType: '',
          path: '',
          component: '',
          name: '',
          icon: null,
          description: '',
          isFullScreen: 1,
          disabled: 1
        }
      }
      this.dialogForm.title1 = type === 1 ? '新建' : '编辑'
      this.dialogForm.show = !this.dialogForm.show
    },
    deleteRole(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menuDelete(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.initGetMenuTree()
          }
        })
      })
    },
    submit(formName) {
      this.isClick = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogForm.params.menuPid = this.Id
          switch (this.dialogForm.title1) {
            case '新建':
              menuAdd(this.dialogForm.params)
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建成功'
                    })
                    this.isClick = false
                    this.dialogForm.show = false
                    this.initGetMenuTree()
                  }
                })
                .catch((err) => {
                  this.isClick = false
                })
              break
            case '编辑':
              menuUpdate({ id: this.editId, ...this.dialogForm.params })
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.isClick = false
                    this.dialogForm.show = false
                    this.initGetMenuTree()
                  }
                })
                .catch(() => {
                  this.isClick = false
                })
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
::v-deep .el-table--border {
  border-bottom: 1px solid #eaeaea;
}
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
::v-deep .menuManagement-table .el-table__fixed-right {
  height: 100% !important;
}
::v-deep .el-table--enable-row-transition {
  height: 100% !important;
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

::v-deep .dataDictionary-table .el-table__fixed-right {
  height: 100% !important;
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

::v-deep .el-card__header {
  padding: 0 16px;
  height: 62px;
}
::v-deep .el-card__body {
  padding-bottom: 0;
}

// 去掉顶部线条
::v-deep .menu-tree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .menu-tree > .el-tree-node::before {
  border-left: none;
}

::v-deep .el-icon-arrow-right {
  position: relative;
  top: 0px;
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
    height: calc(100% - 200px);
    -webkit-box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    border-radius: 2px;
    .menuManagement-table {
      max-height: calc(100% - 100px);
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

::v-deep .tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(90deg) !important;
  transform: rotate(90deg) !important;
}

// 没有子节点
::v-deep .tree .el-tree-node__expand-icon.is-leaf::before {
  // background: url("~@/assets/imgs/tree+.png") no-repeat 0 3px;
  content: '';
  display: none;
  width: 8px;
  height: 8px;
}
::v-deep .operation_box {
  height: 100%;
}
::v-deep .tree {
  margin-left: 0px;
}
/* 树形结构节点添加连线 */
::v-deep .el-tree-node {
  position: relative;
  padding-left: 8px;
}
::v-deep .el-tree-node__content {
  height: 32px;
  padding-left: 0px !important;
}

::v-deep .el-tree-node__children {
  padding-left: 14px;
}

::v-deep .el-tree-node :last-child:before {
  height: 38px;
}

::v-deep .el-tree > .el-tree-node:before {
  border-left: none;
}
::v-deep .tree-container .el-tree > .el-tree-node:after {
  border-top: none;
}

::v-deep .el-tree-node__children .el-tree-node:before {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

::v-deep .el-tree-node:after {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
::v-deep .el-tree-node__expand-icon.is-leaf {
  // display: none;
  padding-left: 4px;
}

::v-deep .el-tree-node:before {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  left: -3px;
  top: -22px;
  border-width: 1px;
  border-left: 1px solid #dddddd;
}

::v-deep .el-tree-node:after {
  content: '';
  width: 24px;
  height: 20px;
  position: absolute;
  left: -4px;
  top: 16px;
  border-width: 1px;
  border-top: 1px solid #dddddd;
}
.tree1 {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  position: relative;
  top: 3px;
}
</style>
