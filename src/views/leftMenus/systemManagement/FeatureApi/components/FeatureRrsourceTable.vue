<template>
  <div class="featureRrsourceTable-content">
    <div class="search">
      <div class="search-form">
        <div class="title-css">功能资源信息</div>
        <!-- <el-button size="mini" @click="goBack(2)">返回</el-button> -->
        <el-button @click="goBack(2)">
          <svg-icon class="svg-btn" icon-class="back-svg" />返回
        </el-button>
      </div>
    </div>

    <div class="table-content">
      <div class="table-content-top">
        <div class="btn-lists">
          <el-button
            v-permission="['/rbac/func/delete', 4]"
            type="primary"
            @click="dialogShow(1)"
            ><svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span></el-button
          >
        </div>
      </div>
      <el-table
        ref="featureRrsourceTable"
        class="table-content-bottom"
        :data="featureRrsourceTable"
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
        <el-table-column
          prop="resourceKey"
          label="资源组"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="validateParam"
          label="需要校验的参数"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="enableMultiCheck"
          label="多维校验状态"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.enableMultiCheck === 0 ? '否' : '是' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="disabled" label="是否禁用" width="120">
          <template slot-scope="scope">
            <el-switch
              v-permission="['/rbac/func/resource/update/disabled', 3]"
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
        <el-table-column width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['/rbac/func/resource/update', 3]"
              type="text"
              @click="dialogShow(0, scope.row)"
              >编辑
            </el-button>
            <el-button
              v-permission="['/rbac/func/resource/delete', 4]"
              type="text"
              @click="deleteUser(scope.row)"
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
          ref="featureResourceRoleForm"
          class="params-form"
          size="mini"
          label-width="150px"
          :rules="rules"
          label-position="right"
          :model="dialogForm.params"
          @keyup.enter="submit('featureResourceRoleForm')"
        >
          <el-form-item label="资源组：" prop="resourceKey">
            <!-- <el-input
              v-model="dialogForm.params.resourceKey"
              style="width: 436px"
            /> -->
            <el-select
              v-model="dialogForm.params.resourceKey"
              class="btn-lists-top-select"
              placeholder="请选择资源类型："
              style="width: 436px"
            >
              <el-option
                v-for="o in resourceKeyOptions"
                :label="o.resourceName"
                :value="o.resourceKey"
                :key="o.resourceKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="需要校验的参数：" prop="validateParam">
            <el-input
              v-model="dialogForm.params.validateParam"
              style="width: 436px"
            />
          </el-form-item>
          <el-form-item label="是否启用多维校验：" prop="enableMultiCheck">
            <el-radio-group v-model="dialogForm.params.enableMultiCheck">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.show = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="isClick"
          @click="submit('featureResourceRoleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'

import {
  getFeatureResourceList,
  featureResourceUpdateDisabled,
  featureResourceUpdate,
  featureAssociate,
  featureResourceDelete
} from '@/api/method/featureApi'
import { getRootList } from '@/api/method/resourceInterface'

import { Local } from '@/utils/storage'

export default {
  name: '',
  components: { pagination },
  data() {
    return {
      searchParams: {
        validateParam: '',
        resourceKey: ''
      },
      resourceKeyOptions: [],
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
          resourceKey: '',
          validateParam: '',
          enableMultiCheck: 0
        }
      },
      rules: {
        resourceKey: [{ required: true, message: '请选择', trigger: 'blur' }],
        validateParam: [
          { required: true, message: '请填写功能名称', trigger: 'blur' }
        ],
        enableMultiCheck: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      Id: '',
      editId: '',
      Ids: [],
      checked: false,
      isInclude: true,
      featureRrsourceTable: [],
      resFuncId: ''
    }
  },
  props: ['funcId'],
  created() {
    this.resFuncId = this.$props.funcId
    this.getRootList()
  },
  watch: {
    funcId(newVal) {
      this.resFuncId = newVal
    }
  },
  methods: {
    async getRootList() {
      await getRootList()
        .then((res) => {
          if (res.data.code === 0) {
            this.resourceKeyOptions = res.data.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    changeResourceType(val) {
      this.searchResourceType = val
    },
    async initFeatureResourceList(id) {
      await getFeatureResourceList({
        funcId: id
      }).then((res) => {
        if (res.data.code === 0) {
          this.featureRrsourceTable = res.data.data
        } else {
          this.$message({
            type: 'warning',
            message: res.data.data
          })
          this.featureRrsourceTable = []
        }
      })
    },

    goBack(val) {
      // this.$emit('getHomeFunc')
      this.$emit('changeIsClickedResourceBtn', val)
    },

    resetData(e) {
      this.searchParams = {
        validateParam: '',
        resourceKey: ''
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
      this.initFeatureResourceList(this.resFuncId)
    },

    deleteUser(row) {
      this.$confirm(`确定删除功能${row.validateParam}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        featureResourceDelete(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.initFeatureResourceList(this.resFuncId)
          }
        })
      })
    },

    dialogShow(type, row) {
      if (type === 0) {
        const { resourceKey, validateParam } = row
        this.dialogForm.params.resourceKey = resourceKey
        this.dialogForm.params.validateParam = validateParam
        this.editId = row.id
      }
      this.dialogForm.title1 = type === 1 ? '新建' : '编辑'
      this.dialogForm.show = !this.dialogForm.show
    },

    submit(formName) {
      this.isClick = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialogForm.title1) {
            case '新建':
              featureAssociate({
                funcId: this.resFuncId,
                ...this.dialogForm.params
              })
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建成功'
                    })
                    this.isClick = false
                    this.dialogForm.show = false
                    this.initFeatureResourceList(this.resFuncId)
                    this.dialogForm.params = {
                      resourceKey: '',
                      validateParam: ''
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
              featureResourceUpdate({
                funcResourceId: this.editId,
                ...this.dialogForm.params
              })
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.isClick = false
                    this.dialogForm.show = false
                    this.initFeatureResourceList(this.resFuncId)
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

      this.$confirm(
        '确认要"' + text + '""' + row.validateParam + '"吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          featureResourceUpdateDisabled({
            funcResourceId: row.id,
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

.featureRrsourceTable-content {
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
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      top: 50%;
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
