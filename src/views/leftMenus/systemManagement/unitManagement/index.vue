<template>
  <div class="department_main">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div>部门管理</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button type="primary" @click.stop="dialogShow()">
            <svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span>
          </el-button>
          <el-button @click.stop="dialogMoveShow()">
            <svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">移动</span>
          </el-button>
          <el-button @click="deleteAccount()">
            <svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">删除</span>
          </el-button>
        </div>
        <leftTree :treeData="treeList" @childClickHandle="childClickHandle" />
      </div>
      <el-card class="right-box-card">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="zzgl" class="tzgg_svg" />
          <span>部门信息</span>
        </div>

        <el-form
          ref="save"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
          class="area-form"
        >
          <el-form-item label="部门信息" prop="orgName">
            <div class="f fd-c mr30">
              <el-input v-model="form.orgName" placeholder="6~20字符" />
            </div>
          </el-form-item>
          <el-form-item label="部门负责人">
            <div class="f fd-c mr30">
              <el-input v-model="form.orgLeader" placeholder="6~20字符" />
            </div>
          </el-form-item>
          <el-form-item label="手机号码">
            <div class="f fd-c mr30">
              <el-input v-model="form.phone" placeholder="6~20字符" />
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button type="primary" @click="save('savePasswordForm')">
            <svg-icon class="svg-btn" icon-class="save" />保 存
          </el-button>
        </div>
      </el-card>
    </div>
    <el-dialog
      v-if="editShow"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="600px"
      :before-close="handleClose"
    >
      <div slot="title" class="dialog-title">
        <LineFont
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div>
        <el-form
          ref="accountForm"
          class="params-form"
          label-position="right"
          label-width="auto"
          :model="dialog.params"
          :rules="rules"
          @keyup.enter="submit('accountForm')"
        >
          <el-form-item label="上级部门" prop="orgPid">
            <el-select
              ref="selectTree"
              v-model="dialog.params.orgPid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 436px"
              class="selectTree"
            >
              <el-option :value="List">
                <el-tree
                  class="unit-tree"
                  :data="treeList"
                  node-key="id"
                  :props="defaultProps"
                  :default-expanded-keys="Ids"
                  ref="tree"
                  highlight-current
                  :expand-on-click-node="false"
                  @node-click="nodeClickHandle"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="部门名称">
            <el-input
              v-model="dialog.params.orgName"
              placeholder="最多40个字符"
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="部门负责人">
            <el-input
              v-model="dialog.params.orgLeader"
              placeholder="最多40个字符"
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="手机号码">
            <el-input
              v-model="dialog.params.phone"
              placeholder="最多40个字符"
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="dialog.params.description" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('accountForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <moveTree :moveShow="moveShow" :treeData="treeList" @init="init" />
  </div>
</template>

<script>
import moveTree from './components/MoveTree'
import {
  unitAdd,
  unitEdit,
  unitList,
  unitDelete,
  getUnitDetails
} from '@/api/method/unitManagement'
import { Local } from '@/utils/storage'
import leftTree from '../components/leftTree'
import LineFont from '@/components/LineFont'

import { getDepartmentTree } from '@/api/method/role'

// import TreeSelect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: '',
  components: { leftTree, LineFont, moveTree },
  data() {
    return {
      lineTitle: {
        title: '新建分组',
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
      dialog: {
        show: false,
        title: '新建部门',
        params: {
          orgPid: '',
          description: '',
          orgLeader: '',
          orgName: '',
          phone: ''
        }
      },
      editShow: false,
      form: {
        orgName: '',
        description: '',
        phone: '',
        orgLeader: ''
      },
      rules: {
        orgName: {
          required: true,
          message: '不能为空',
          trigger: 'blur',
          max: 20
        },
        orgPid: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        },
        fzmc: {
          required: true,
          message: '不能为空',
          trigger: 'blur',
          max: 40
        }
      },
      treeData: [],
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      detailsId: '',
      moveShow: false
    }
  },
  watch: {
    form(val) {
      //  this.form=val
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 点击节点选中
    nodeClickHandle(data) {
      this.dialog.params.orgPid = data.orgName
      this.Id = data.id
      this.$refs.selectTree.blur()
    },

    childClickHandle(data) {
      this.detailsId = data.id
      this.getUnitDetailsData()
    },
    getUnitDetailsData() {
      getUnitDetails(this.detailsId).then((res) => {
        if (res.code === 0) {
          // Object.keys(res.data).forEach((key) => {
          //   this.form[key] = res.data[key] || this.form[key]
          // })
          this.form.orgName = res.data.orgName
          this.form.description = res.data.description
          this.form.phone = res.data.phone
          this.form.orgLeader = res.data.orgLeader
        }
      })
    },
    async init(id) {
      await getDepartmentTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data
            this.detailsId = id ? id : res.data[0].id
            this.getUnitDetailsData()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleClose(done) {
      done()
    },
    dialogShow() {
      ;(this.dialog.params = {
        orgPid: '',
        description: '',
        orgLeader: '',
        orgName: '',
        phone: ''
      }),
        (this.editShow = true)

      this.dialog.show = !this.dialog.show
    },
    dialogMoveShow() {
      this.moveShow = !this.moveShow
    },
    save() {
      unitEdit({ id: this.detailsId, ...this.form }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.init(res.data.id)
          // this.getUnitDetailsData()
        }
      })
    },
    deleteAccount() {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unitDelete(this.detailsId).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.init()
            this.detailsId = this.treeList[0].id
            this.getUnitDetailsData()
          }
        })
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '新建部门':
              this.dialog.params.orgPid = this.Id
              unitAdd(this.dialog.params).then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新建成功'
                  })

                  this.dialog.show = false
                  this.detailsId = res.data.id
                  this.init(this.detailsId)
                  // this.getUnitDetailsData()
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
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}
::v-deep .el-dialog__footer {
  padding: 0;
}
// ::v-deep .el-select-dropdown__item {
//   background-color: #fff !important;
//   padding: 0;
//   margin: 0 20px;
// }
// .el-select-dropdown__item {
//   height: 200px !important;
//   min-width: 260px;
//   overflow-y: scroll !important;
//   background: #fff !important;
// }
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}
.el-select-dropdown__item .el-tree-node__label {
  font-weight: normal;
}
.el-select-dropdown__item::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.el-select-dropdown__item::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 6px;
}
.filterStyle {
  padding: 5px 20px;
  width: 260px;
}

.department_main {
  .panel-header-box {
    margin: 0;
    padding: 0 16px;
    border-top: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .main-content {
    height: calc(100% - 60px);
    display: flex;
    justify-content: space-between;
    .securityArea_container {
      height: calc(100% - 40px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
      .btn-lists {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0 10px;
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
    .right-box-card {
      width: 100%;
      margin: 20px 20px 20px 0;
      position: relative;
      .dialog-footer {
        width: 100%;
        height: 52px;
        line-height: 52px;
        position: absolute;
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
    }
  }
}
.area-form {
  .el-input {
    width: 436px;
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
::v-deep .el-textarea__inner {
  width: 436px;
  height: 300px;
}
.setstyle {
  min-height: 200px;
  padding: 0 !important;
  margin: 0;
  overflow: auto;
  cursor: default !important;
}
// 去掉顶部线条
.unit-tree {
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }
}
</style>
