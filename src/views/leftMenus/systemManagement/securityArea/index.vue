<template>
  <div class="main">
    <div class="panel-header-box">
      <div class="panel-header-box-border">安防区域</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button type="primary" @click="dialogShow">
            <svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span>
          </el-button>
          <el-button @click="dialogMoveShow"
            ><svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">移动</span>
          </el-button>
          <el-button @click="deleteAccount"
            ><svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">删除</span>
          </el-button>
        </div>
        <leftTree
          ref="securityAreaTree"
          :treeData="treeList"
          @childClickHandle="childClickHandle"
          :defaultPropsName="areaNames"
        />
      </div>
      <el-card class="right-box-card">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="fzxx" class="tzgg_svg" />
          <span class="right-box-card-span">分组信息</span>
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
              <el-input
                v-model="form.areaName"
                placeholder="请输入"
                clearable
              />
            </div>
          </el-form-item>
          <el-form-item label="描述" prop="description">
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
          size="mini"
          label-position="right"
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
              style="width: 436px"
              class="selectTree"
            >
              <el-option :value="List">
                <el-tree
                  class="securityArea-tree"
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
              placeholder="请输入"
              clearable
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input
              v-model="dialog.params.description"
              type="textarea"
              placeholder="多行输入"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submit('accountForm')"
          :loading="isLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <moveTree
      ref="moveTree"
      :treeData="treeList"
      @init="init"
      :fatherId="fatherId"
    />
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

import { antiShake } from '@/utils/index.js'

export default {
  name: '',
  components: { leftTree, LineFont, moveTree },
  data() {
    const checkAreaName = (rule, value, cb) => {
      const regAreaName = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regAreaName.test(value)) {
          return cb()
        } else {
          return cb(
            new Error(
              `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `
            )
          )
        }
      }, 500)
    }
    return {
      areaNames: 'areaNames',
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
      isLoading: false,
      rules: {
        areaName: {
          validator: checkAreaName,
          required: true,
          max: 32,
          trigger: 'blur'
        },
        areaPid: {
          required: true,
          message: '此为必填项。',
          trigger: 'change'
        },
        description: {
          message: '支持最大长度128个字符。',
          trigger: 'change',
          max: 128
        }
      },
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      fatherId: '',
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      detailsId: '',
      moveShow: false,
      treeMsg: '',
      isMore: false
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
      this.dialog.params.areaPid = data.areaName
      this.Id = data.id
      this.$refs.selectTree.blur()
    },

    childClickHandle(data) {
      this.fatherId = data.id
      if (data.children && data.children.length > 0) {
        this.isMore = true
        this.treeMsg = data.areaName
      } else {
        this.isMore = false
        this.treeMsg = data.areaName
      }
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
      if (this.$refs.accountForm) {
        this.$refs.accountForm.resetFields()
        // this.dialog.params = {
        //   areaPid: '',
        //   description: '',
        //   areaName: ''
        // }
      }
      this.editShow = true

      this.dialog.show = !this.dialog.show
    },
    dialogMoveShow() {
      this.$refs.moveTree.changeMoveTreeShow()
    },
    save() {
      unitEdit({ id: this.detailsId, ...this.form }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.$refs.securityAreaTree.chooseId(this.detailsId)
          this.init(this.detailsId)
        }
      })
    },
    deleteAccount() {
      const h = this.$createElement
      this.$confirm('提示', {
        title: '提示',
        message: !this.isMore
          ? `确定删除分组${this.treeMsg}？`
          : h('div', [
              h('p', `此操作将删除${this.treeMsg}及其下级节点`),
              h('p', { style: 'position:relative;top:20px;' }, '确定删除？')
            ]),
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
    submit: antiShake(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '新建部门':
              this.dialog.params.areaPid = this.Id
              this.isLoading = true
              unitAdd(this.dialog.params).then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新建成功'
                  })
                  this.isLoading = false
                  this.dialog.show = false
                  this.detailsId = res.data.id
                  this.init(this.detailsId)

                  this.$refs.securityAreaTree.chooseId(this.Id)
                }
              })
              break
            default:
              break
          }
        }
      })
    })
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
// 去掉顶部线条
::v-deep .securityArea-tree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .securityArea-tree > .el-tree-node::before {
  border-left: none;
}
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
      .tzgg_svg {
        position: relative;
        top: 1px;
        left: -4px;
      }
      .right-box-card-span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
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
  height: 168px;
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
