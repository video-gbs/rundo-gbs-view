<template>
  <div class="department_main" v-if="isShow">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div>部门管理</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button
            v-permission="['/rabc/section/add', 1]"
            type="primary"
            @click="dialogShow"
          >
            <svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span>
          </el-button>
          <el-button
            v-permission="['/rabc/section/move/fs', 3]"
            @click="dialogMoveShow"
          >
            <svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">移动</span>
          </el-button>
          <div
            v-permission="['/rabc/section/move/bt', 3]"
            v-if="isClickTreeSort"
            @click="treeSort(1)"
            class="sort_div"
          >
            <svg-icon class="svg-btn" icon-class="sort-b" />
            <span class="btn-span">排序</span>
          </div>
          <div
            v-permission="['/rabc/section/move/bt', 3]"
            v-else
            @click="treeSort(2)"
            class="clicked-button sort_div"
          >
            <svg-icon class="svg-btn" icon-class="sort" />
            <span class="btn-span">排序</span>
          </div>
          <el-button
            v-permission="['/rabc/section/delete', 4]"
            @click="deleteAccount($event)"
          >
            <svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">删除</span>
          </el-button>
        </div>
        <leftTree
          ref="unitTree"
          class="unitTree"
          :treeData="treeList"
          :currentKey="currentKey"
          :defaultPropsName="areaNames"
          :isClickTreeSort="isClickTreeSort"
          @childClickHandle="childClickHandle"
          @changeSort="changeSort"
        />
      </div>
      <el-card class="right-box-card">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="zzgl" class="tzgg_svg" />
          <span>部门信息</span>
        </div>

        <el-form
          ref="unitManagementForm"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
          class="area-form"
        >
          <el-form-item label="部门信息" prop="sectionName">
            <div class="f fd-c mr30">
              <el-input
                v-model="form.sectionName"
                placeholder="请输入"
                clearable
              />
            </div>
          </el-form-item>
          <el-form-item label="部门负责人" prop="leaderName">
            <div class="f fd-c mr30">
              <el-input
                v-model="form.leaderName"
                placeholder="请输入"
                clearable
              />
            </div>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <div class="f fd-c mr30">
              <el-input v-model="form.phone" placeholder="请输入" clearable />
            </div>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              placeholder="多行输入"
            />
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button
            v-permission="['/rabc/section/update', 3]"
            type="primary"
            :disabled="fatherName === '根节点'"
            @click="save('unitManagementForm')"
          >
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
          :rules="dialogRules"
          @keyup.enter="submit('accountForm')"
        >
          <el-form-item label="上级部门" prop="sectionPid">
            <el-select
              ref="selectTree"
              v-model="dialog.params.sectionPid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 436px"
              class="selectTree"
            >
              <el-option :value="dialog.params.sectionPid">
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

          <el-form-item label="部门名称" prop="sectionName">
            <el-input
              v-model="dialog.params.sectionName"
              placeholder="请输入"
              clearable
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="部门负责人" prop="leaderName">
            <el-input
              v-model="dialog.params.leaderName"
              placeholder="请输入"
              clearable
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="dialog.params.phone"
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
          :loading="isClick"
          @click="submit('accountForm')"
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
import moveTree from './components/MoveTree'
import {
  getUnitList,
  moveUnitFz,
  moveUnitXd,
  unitAdd,
  unitUpdate,
  unitDelete
} from '@/api/method/unitManagement'
import { Local } from '@/utils/storage'
import leftTree from '../components/leftTree'
import LineFont from '@/components/LineFont'

import { getDepartmentTree } from '@/api/method/role'

export default {
  name: '',
  components: { leftTree, LineFont, moveTree },
  data() {
    const checkOrgName = (rule, value, cb) => {
      const regOrgName = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regOrgName.test(value)) {
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
    const checkOrgName1 = (rule, value, cb) => {
      const regOrgName1 = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb()
      }
      setTimeout(() => {
        if (regOrgName1.test(value)) {
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
    const checkPhone = (rule, value, cb) => {
      const regPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (value === '' || value === null || value.length === 0) {
        return cb()
      }
      setTimeout(() => {
        if (regPhone.test(value)) {
          return cb()
        } else {
          return cb(new Error(`1～11个数字。`))
        }
      }, 1000)
    }

    return {
      isShow: false,
      lineTitle: {
        title: '新建部门',
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
          sectionPid: '',
          description: '',
          leaderName: '',
          sectionName: '',
          phone: ''
        }
      },
      isClickTreeSort: true,
      isClick: false,
      editShow: false,
      currentKey: '0',
      areaNames: 'sectionName',
      form: {
        sectionName: '',
        description: '',
        phone: '',
        leaderName: ''
      },
      rules: {
        sectionName: [
          {
            validator: checkOrgName,
            max: 32,
            required: true,
            trigger: 'blur'
          }
        ],
        leaderName: [
          {
            validator: checkOrgName1,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            max: 11,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        description: {
          message: '支持最大长度128个字符。',
          trigger: 'blur',
          max: 128
        }
      },
      dialogRules: {
        sectionName: [
          {
            validator: checkOrgName,
            required: true,
            trigger: 'blur'
          }
        ],
        leaderName: [
          {
            validator: checkOrgName1,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        description: {
          message: '支持最大长度128个字符。',
          trigger: 'blur',
          max: 128
        },
        sectionPid: {
          required: true,
          message: '此为必填项。',
          trigger: 'change'
        }
      },
      treeData: [],
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      fatherId: '1',
      fatherName: '根节点',
      defaultProps: {
        children: 'childList',
        label: 'sectionName'
      },
      detailsId: '',
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
    this.init(this.detailsId)
  },
  methods: {
    // 点击节点选中
    nodeClickHandle(data) {
      this.dialog.params.sectionPid = data.sectionName
      this.Id = data.id
      this.$refs.selectTree.blur()
    },

    childClickHandle(data) {
      console.log(data)
      this.fatherId = data.id
      this.fatherName = data.sectionName
      if (data.childList && data.childList.length > 0) {
        this.isMore = true
        this.treeMsg = data.sectionName
      } else {
        this.isMore = false
        this.treeMsg = data.sectionName
      }
      this.detailsId = data.id
      // this.$refs['unitManagementForm'].resetFields()
      this.getUnitDetailsData(data)
    },
    getUnitDetailsData(res) {
      // getUnitList(this.detailsId).then((res) => {
      //   if (res.data.code === 0) {
      this.form.sectionName = res.sectionName
      this.form.description = res.description
      this.form.phone = res.phone
      this.form.leaderName = res.leaderName
      //   }
      // })
    },

    getDetailsLists(arr, id) {
      arr.map((item) => {
        if (item.id === id) {
          return item
        } else {
          if (item.childList && item.childList.length > 0) {
            this.getDetailsLists(item.childList, id)
          }
        }
      })
    },
    treeSort(val) {
      if (val === 1) {
        this.isClickTreeSort = false
      } else {
        this.isClickTreeSort = true
      }
    },
    changeSort(val, id) {
      if (val === 0) {
        moveUnitXd({
          id,
          moveOp: val
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '移动成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.data
            })
          }
          this.init(this.detailsId)
        })
      } else {
        moveUnitXd({
          id,
          moveOp: val
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '移动成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.data
            })
          }
          this.init(this.detailsId)
        })
      }
    },

    async init(id) {
      await getUnitList()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList = [res.data.data]
            let resData = {}
            if (id && id !== undefined && id !== '') {
              this.detailsId = id
              resData = this.getDetailsLists(this.treeList, id)
            } else {
              this.detailsId = res.data.data.id
              resData = res.data.data
            }
            this.getUnitDetailsData(resData)
            setTimeout(() => {
              this.isShow = true
            }, 100)
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
      this.editShow = true
      this.dialog.params = {
        sectionPid: '',
        description: '',
        leaderName: '',
        sectionName: '',
        phone: ''
      }

      console.log('this.sectionPid', this.fatherName)
      this.dialog.params.sectionPid = this.fatherName
      this.dialog.show = !this.dialog.show
    },
    dialogMoveShow() {
      this.$refs.moveTree.changeMoveTreeShow()
    },
    save(formName) {
      console.log('formName', formName, this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          unitUpdate({ id: this.detailsId, ...this.form }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.fatherName = this.form.sectionName
              this.$refs.unitTree.chooseId(this.detailsId)
              this.init(this.detailsId)
            }
          })
        }
      })
    },
    deleteAccount(e) {
      const h = this.$createElement
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
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
        unitDelete(this.detailsId)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.init()
            } else {
              this.$message({
                type: 'warning',
                message: res.data.data
              })
            }
          })
          .catch((error) => {
            console.log(11111, error)
          })
      })
    },
    submit(formName) {
      this.isClick = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '新建部门':
              this.dialog.params.sectionPid = this.Id ? this.Id : this.fatherId
              unitAdd(this.dialog.params)
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建成功'
                    })
                    this.dialog.show = false
                    this.isClick = false
                    this.detailsId = res.data.id
                    this.init(this.detailsId)
                  }
                })
                .catch((error) => {
                  this.isClick = false
                })
              break
            case '编辑':
              editApplication({ id: this.editId, ...this.dialog.params })
                .then((res) => {
                  if (res.data.code === 0) {
                    this.isClick = false
                    this.$message.success('编辑成功')
                    this.$refs.unitTree.chooseId(this.dialog.params.sectionPid)
                    this.dialog.show = false
                    this.getList()
                  }
                })
                .catch((error) => {
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
::v-deep .btn-lists > .el-button {
  margin-left: 0 !important;
}
::v-deep .unitTree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 没有展开且有子节点
::v-deep .unitTree .el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeOpen.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 已经展开且有子节点
::v-deep
  .unitTree
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeClose.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 没有子节点
::v-deep .unitTree .el-tree-node__expand-icon.is-leaf::before {
  display: none;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}
::v-deep .el-dialog__footer {
  padding: 0;
}
// 去掉顶部线条
::v-deep .unit-tree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .unit-tree > .el-tree-node::before {
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
          width: 70px;
          height: 32px;
        }
        .sort_div {
          display: inline-block;
          line-height: 32px;
          white-space: nowrap;
          text-align: center;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          width: 70px;
          height: 32px;
          .btn-span {
            position: relative;
            top: -2px;
            font-size: 14px;
            color: #606266;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
          }
          .svg-btn {
            position: relative;
            top: 1px;
            left: -6px;
          }
        }
        .clicked-button {
          border: 1px solid #0270ff !important;
          .btn-span {
            color: #0270ff !important;
          }
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
  height: 128px;
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
