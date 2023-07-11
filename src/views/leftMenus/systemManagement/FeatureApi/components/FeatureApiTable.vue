<template>
  <div class="featureApiTable-content">
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="服务名称:">
          <el-input
            v-model="searchParams.serviceName"
            clearable
            :maxlength="15"
          />
        </el-form-item>
        <el-form-item label="功能名称:">
          <el-input v-model="searchParams.funcName" clearable :maxlength="15" />
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
          v-model="isInclude"
          class="table-content-top-check"
          @change="changeAccountChecked"
          >包含下级组织</el-checkbox
        >
        <div class="btn-lists">
          <!-- <el-button @click="deteleAll($event)" style="width: 100px" plain
            ><svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">批量删除</span></el-button
          > -->
          <el-button type="primary" @click="dialogShow(1)"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span></el-button
          >
        </div>
      </div>
      <el-table
        ref="featureApiTable"
        class="table-content-bottom"
        :data="featureApiTableData"
        border
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
      >
        <!-- <el-table-column type="selection" width="80" align="center">
        </el-table-column> -->
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="serviceName"
          label="服务名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="funcName"
          label="功能名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="path"
          label="资源路径"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="method" label="请求方法">
          <template slot-scope="scope">
            <span v-for="item in methodOptions" :key="item.value">{{
              item.value === scope.row.method ? item.label : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="disabled" label="是否禁用" width="120">
          <template slot-scope="scope">
            <el-switch
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
        <el-table-column width="160" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goResourceDetail(1, scope.row.id)"
              >资源详情
            </el-button>
            <el-button type="text" @click="dialogShow(0, scope.row)"
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

    <el-dialog
      v-if="dialogForm.show"
      :title="dialogForm.title1"
      :visible.sync="dialogForm.show"
      width="650px"
    >
      <div>
        <el-form
          ref="featureApiRoleForm"
          class="params-form"
          size="mini"
          label-width="120px"
          :rules="rules"
          label-position="right"
          :model="dialogForm.params"
          @keyup.enter="submit('featureApiRoleForm')"
        >
          <el-form-item label="菜单Id：" prop="menuId">
            <el-select
              ref="selectTree"
              v-model="dialogForm.params.menuId"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 436px"
              class="selectTree"
              id="selectTree"
            >
              <el-option :value="dialogForm.params.menuId">
                <el-tree
                  ref="tree"
                  class="unit-tree"
                  :data="featureApiTableTreeData"
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
          <el-form-item label="服务名称：" prop="serviceName">
            <el-input
              v-model="dialogForm.params.serviceName"
              style="width: 436px"
            />
          </el-form-item>
          <el-form-item label="功能名称：" prop="funcName">
            <el-input
              v-model="dialogForm.params.funcName"
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="范围：" prop="scope">
            <el-input v-model="dialogForm.params.scope" style="width: 436px" />
          </el-form-item>

          <el-form-item prop="method" label="请求方法：">
            <el-select
              v-model="dialogForm.params.method"
              placeholder="请选择"
              style="width: 436px"
            >
              <el-option
                v-for="o in methodOptions"
                :label="o.label"
                :value="o.value"
                :key="o.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="访问地址：" prop="path">
            <el-input v-model="dialogForm.params.path" style="width: 436px" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.show = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="isClick"
          @click="submit('featureApiRoleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'

import {
  getFeatureList,
  featureUpdateDisabled,
  featureResourceUpdateDisabled,
  featureResourceUpdate,
  featureAssociate,
  featureAdd,
  featureUpdate,
  featureDelete,
  featureResourceDelete
} from '@/api/method/featureApi'

import { Local } from '@/utils/storage'

export default {
  name: '',
  components: { pagination },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchParams: {
        funcName: '',
        serviceName: ''
      },
      isClick: false,
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      methodOptions: [
        { label: 'post', value: 2 },
        { label: 'get', value: 1 },
        { label: 'put', value: 3 },
        { label: 'delete', value: 4 }
      ],
      resName: '',
      dialogForm: {
        show: false,
        title1: '新建',
        params: {
          menuId: '',
          serviceName: '',
          scope: '',
          funcName: '',
          path: '',
          method: ''
        }
      },
      rules: {
        menuId: [{ required: true, message: '请选择', trigger: 'change' }],
        serviceName: [{ required: true, message: '请选择', trigger: 'blur' }],
        scope: [{ required: true, message: '请填写范围', trigger: 'blur' }],
        funcName: [
          { required: true, message: '请填写功能名称', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请填写请求方法', trigger: 'blur' }],
        method: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      Id: '',
      editId: '',
      Ids: [],
      checked: false,
      isInclude: true,
      featureApiTableData: [],
      featureApiId: '0',
      fatherName: ''
    }
  },
  props: {
    featureApiTableTreeData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  created() {
    this.params.pageNum = Local.get('featureApiTablePageNum')
    Local.remove('featureApiTablePageNum')
  },
  mounted() {
    // this.getList()
  },
  methods: {
    async getList(id) {
      await getFeatureList({
        page: this.params.pageNum,
        num: this.params.pageSize,
        menuId: id ? id : this.featureApiId,
        isInclude: this.isInclude,
        ...this.searchParams
      }).then((res) => {
        if (res.data.code === 0) {
          this.featureApiTableData = res.data.data.list
          this.params.total = res.data.data.total
          this.params.pages = res.data.data.pageNum
          this.params.current = res.data.data.pageSize
        } else {
          this.$message({
            type: 'warning',
            message: res.data.data
          })
          this.featureApiTableData = []
        }
      })
    },
    changeName(data) {
      this.fatherName = data.name
      this.Id = data.id
    },
    nodeClickHandle(data) {
      this.dialogForm.params.menuId = data.name
      this.fatherName = data.name
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    changeAccountChecked(val) {
      this.getList()
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
        funcName: '',
        serviceName: ''
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
    saveId(id) {
      this.featureApiId = id
    },
    deleteUser(row) {
      this.$confirm(`确定删除功能${row.funcName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        featureDelete(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList(this.featureApiId)
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
    cxData() {
      this.getList()
    },
    goResourceDetail(val, id) {
      this.$emit('changeIsClickedResourceBtn', val, id)
    },

    dialogShow(type, row) {
      if (type === 0) {
        const { menuId, serviceName, scope, funcName, path, method } = row
        this.dialogForm.params.serviceName = serviceName
        this.dialogForm.params.scope = scope
        this.dialogForm.params.funcName = funcName
        this.dialogForm.params.path = path
        this.dialogForm.params.method = method
        this.editId = row.id

        this.getTreeName(this.featureApiTableTreeData, menuId)
        this.dialogForm.params.menuId = this.resName
      }
      this.dialogForm.title1 = type === 1 ? '新建' : '编辑'

      this.dialogForm.params.menuId = this.fatherName
      this.dialogForm.show = !this.dialogForm.show
    },

    submit(formName) {
      this.isClick = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogForm.params.menuId = this.Id
          switch (this.dialogForm.title1) {
            case '新建':
              featureAdd(this.dialogForm.params)
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建成功'
                    })
                    this.isClick = false
                    this.dialogForm.show = false
                    this.getList(this.Id)
                    this.dialogForm.params = {
                      menuId: '',
                      serviceName: '',
                      scope: '',
                      funcName: '',
                      path: '',
                      method: ''
                    }
                  } else {
                    this.isClick = false
                  }
                })
                .catch(() => {
                  this.isClick = false
                })
              break
            case '编辑':
              featureUpdate({ id: this.editId, ...this.dialogForm.params })
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.isClick = false
                    this.dialogForm.show = false
                    this.getList(this.featureApiId)
                  } else {
                    this.isClick = false
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
    },

    changeSwitch(row) {
      let text = row.disabled === 0 ? '启用' : '停用'

      this.$confirm('确认要"' + text + '""' + row.funcName + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          featureUpdateDisabled({
            id: row.id,
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

// 去掉顶部线条
::v-deep .unit-tree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .unit-tree > .el-tree-node::before {
  border-left: none;
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

.featureApiTable-content {
  height: 100%;
  .search {
    width: 100%;
    height: 80px;
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
  .params-form {
    .el-input,
    .el-select {
      width: 100%;
      margin-right: 30px;
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

  .featureApiTable_container {
    height: calc(100% - 40px);
    width: 310px;
    margin: 10px;
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
