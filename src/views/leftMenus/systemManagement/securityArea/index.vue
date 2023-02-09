<template>
  <div class="main">
    <div class="panel-header-box">
      <div>安防区域</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button type="primary" @click="dialogShow()"
            ><svg-icon class="svg-btn" icon-class="add" />新增</el-button
          >
          <el-button @click="dialogMoveShow()"
            ><svg-icon class="svg-btn" icon-class="move" />移动</el-button
          >
          <el-button @click="deleteAccount()"
            ><svg-icon class="svg-btn" icon-class="del" />删除</el-button
          >
        </div>
        <leftTree :treeData="treeList" @childClickHandle="childClickHandle" />
      </div>
      <el-card class="right-box-card">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="zzgl" class="tzgg_svg" />
          <span>分组信息</span>
        </div>

        <el-form
          ref="save"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
          class="area-form"
        >
          <el-form-item label="分组名称" prop="areaName">
            <div class="f fd-c mr30">
              <el-input v-model="form.areaName" placeholder="6~20字符" />
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button type="primary" @click="save('savePasswordForm')"
            ><svg-icon class="svg-btn" icon-class="save" />保 存</el-button
          >
        </div>
      </el-card>
    </div>
    <el-dialog
      v-if="editShow"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="748px"
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
          size="mini"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          :rules="rules"
          @keyup.enter="submit('accountForm')"
        >
          <el-form-item label="上级分组" prop="areaPid">
            <el-select
              ref="selectTree"
              v-model="dialog.params.areaPid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 272px"
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
                >
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="分组名称" prop="areaName">
            <el-input
              v-model="dialog.params.areaName"
              placeholder="最多40个字符"
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
import leftTree from '../components/leftTree'
import LineFont from '@/components/LineFont'
import moveTree from './components/MoveTree'
import { getVideoAraeTree } from '@/api/method/role'

import {
  unitAdd,
  unitEdit,
  unitList,
  unitDelete,
  getUnitDetails
} from '@/api/method/securityArea'

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
          areaPid: '',
          description: '',
          areaName: ''
        }
      },
      editShow: false,
      form: {
        areaName: '',
        description: ''
      },
      rules: {
        areaName: {
          required: true,
          message: '不能为空',
          trigger: 'blur',
          max: 20
        },
        areaPid: {
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
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      detailsId: '',
      moveShow: false
    }
  },
  watch: {
    form(val) {
      console.log(1111, val)
      //  this.form=val
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 点击节点选中
    nodeClickHandle(data) {
      this.dialog.params.areaPid = data.areaName
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
          this.form.areaName = res.data.areaName
          this.form.description = res.data.description
        }
      })
    },
    async init(id) {
      await getVideoAraeTree()
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
        areaPid: '',
        description: '',
        areaName: ''
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
              this.dialog.params.areaPid = this.Id
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

.main {
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
  .main-content {
    height: calc(100% - 0px);
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
        .svg-btn {
          position: relative;
          top: 1px;
          left: -4px;
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
