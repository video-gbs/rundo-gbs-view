<template>
  <div class="department_main" v-if="isShow">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div>资源接口</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <div class="btn-lists-top">
          <el-select
            v-model="searchResourceType"
            class="btn-lists-top-select"
            placeholder="请选择资源类型："
            style="width: 436px; margin-right: 10px"
            @change="changeResourceType"
          >
            <el-option
              v-for="o in resourceKeyOptions"
              :label="o.resourceName"
              :value="o.resourceKey"
              :key="o.resourceName"
            />
          </el-select>
          <el-button
            v-permission="['/rbac/resource/root/add', 2]"
            type="primary"
            @click="dialogRootShow"
          >
            <svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增资源组</span>
          </el-button>
        </div>
        <div class="btn-lists">
          <el-button
            v-permission="['/rbac/resource/batch/add', 2]"
            type="primary"
            @click="dialogShow"
          >
            <svg-icon class="svg-btn" icon-class="add" />
            <span class="btn-span">新增</span>
          </el-button>
          <el-button
            v-permission="['/rbac/resource/move/fs', 3]"
            @click="dialogMoveShow"
          >
            <svg-icon class="svg-btn" icon-class="move" />
            <span class="btn-span">移动</span>
          </el-button>
          <div
            v-permission="['/rbac/resource/move/bt', 3]"
            v-if="isClickTreeSort"
            @click="treeSort(1)"
            class="sort_div"
          >
            <svg-icon class="svg-btn" icon-class="sort-b" />
            <span class="btn-span">排序</span>
          </div>
          <div
            v-permission="['/rbac/resource/move/bt', 3]"
            v-else
            @click="treeSort(2)"
            class="clicked-button sort_div"
          >
            <svg-icon class="svg-btn" icon-class="sort" />
            <span class="btn-span">排序</span>
          </div>
          <el-button
            v-permission="['/rbac/resource/delete', 4]"
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
          :isClickTreeSort="isClickTreeSort"
          :defaultPropsName="resourceName1"
          @childClickHandle="childClickHandle"
          @changeSort="changeSort"
        />
      </div>
      <el-card class="right-box-card">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="zzgl" class="tzgg_svg" />
          <span>资源接口信息</span>
        </div>

        <el-form
          ref="unitManagementForm"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
          class="area-form"
        >
          <el-form-item label="资源名称" prop="resourceName">
            <div class="f fd-c mr30">
              <el-input
                v-model="form.resourceName"
                placeholder="请输入"
                clearable
              />
            </div>
          </el-form-item>

          <el-form-item label="资源value" prop="resourceValue">
            <el-input
              v-model="form.resourceValue"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button
            v-permission="['/rbac/resource/update', 3]"
            type="primary"
            @click="save('unitManagementForm')"
          >
            <svg-icon class="svg-btn" icon-class="save" />保 存
          </el-button>
        </div>
      </el-card>
    </div>

    <el-dialog
      v-if="editRootShow"
      :title="dialogRoot.title"
      :visible.sync="dialogRoot.show"
      width="600px"
      :before-close="handleCloseRoot"
    >
      <div slot="title" class="dialog-title">
        <LineFont
          :line-title="lineTitleRoot"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div>
        <el-form
          ref="accountRootForm"
          class="params-form"
          label-position="right"
          label-width="auto"
          :model="dialogRoot.params"
          :rules="dialogRootRules"
          @keyup.enter="submitRoot('accountRootForm')"
        >
          <el-form-item label="资源名称" prop="resourceName">
            <el-input
              v-model="dialogRoot.params.resourceName"
              placeholder="请输入"
              clearable
              style="width: 386px"
            />
          </el-form-item>

          <el-form-item label="资源key" prop="resourceKey">
            <el-input
              v-model="dialogRoot.params.resourceKey"
              placeholder="请输入"
              clearable
              style="width: 386px"
            />
          </el-form-item>

          <el-form-item label="资源value" prop="resourceValue">
            <el-input
              v-model="dialogRoot.params.resourceValue"
              placeholder="请输入"
              clearable
              style="width: 386px"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoot.show = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="isClickRoot"
          @click="submitRoot('accountRootForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

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
          <el-form-item label="父节点名称" prop="resourcePid">
            <el-select
              ref="selectTree"
              v-model="dialog.params.resourcePid"
              placeholder="请选择"
              :popper-append-to-body="false"
              style="width: 386px"
              class="selectTree"
            >
              <el-option :value="dialog.params.resourcePid">
                <el-tree
                  ref="dialogTree"
                  class="unit-tree"
                  :data="treeList1"
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
          <el-form-item label="资源类型" prop="resourceType">
            <el-select
              v-model="dialog.params.resourceType"
              placeholder="请选择资源类型"
              style="width: 386px"
              @change="changeDialogResourceType"
            >
              <el-option
                v-for="o in dialogResourceKeyOptions"
                :label="o.label"
                :value="o.value"
                :key="o.value"
              />
            </el-select>
          </el-form-item>
          <el-button
            class="add_resource"
            icon="el-icon-circle-plus"
            @click="addProduct()"
            >新增多个资源组</el-button
          >

          <div
            v-for="(item, index) in groupNameLists"
            :key="index"
            class="group_name_lists"
          >
            <div>
              <el-form-item label="资源名称" prop="resourceName">
                <el-input
                  v-model="dialog.params.resourceName[index]"
                  placeholder="请输入"
                  clearable
                  style="width: 386px"
                  @change="
                    (val) => {
                      changeGroupNameLists(val, 'resourceName', index)
                    }
                  "
                />
              </el-form-item>

              <el-form-item label="资源value" prop="resourceValue">
                <el-input
                  v-model="dialog.params.resourceValue[index]"
                  placeholder="请输入"
                  style="width: 386px"
                  @change="
                    (val) => {
                      changeGroupNameLists(val, 'resourceValue', index)
                    }
                  "
                  clearable
                />
              </el-form-item>
            </div>

            <el-button
              v-if="index >= 1"
              style="float: right; color: red"
              type="text"
              @click="deleteDate(index)"
            >
              删除
            </el-button>
          </div>
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
      :resourceType="searchResourceType"
      @init="init"
      :fatherId="fatherId"
    />
  </div>
</template>

<script>
import moveTree from './components/MoveTree'
import {
  getResourceList,
  getRootList,
  moveResourceXd,
  resourceAdd,
  resourceRootAdd,
  resourceUpdate,
  resourceDelete
} from '@/api/method/resourceInterface'
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
      resourceName1: 'resourceName',
      lineTitle: {
        title: '新建资源',
        notShowSmallTitle: false
      },
      lineTitleRoot: {
        title: '新建根节点资源',
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
      isClickTreeSort: true,
      resourceKeyOptions: [],
      dialogResourceKeyOptions: [
        {
          label: '目录',
          value: 1
        },
        {
          label: '资源',
          value: 2
        }
      ],
      searchResourceType: '',
      dialogResourceName: [],
      dialogResourceValue: [],
      dialog: {
        show: false,
        title: '新建资源',
        params: {
          resourcePid: '',
          resourceName: [],
          resourceType: '',
          resourceKey: '',
          // groupName: '',
          resourceValue: [],
          resourceMap: {}
        }
      },
      dialogRoot: {
        show: false,
        title: '新建根节点资源',
        params: {
          resourceName: '',
          resourceKey: '',
          resourceValue: ''
        }
      },
      isClick: false,
      isClickRoot: false,
      editShow: false,
      editRootShow: false,
      groupNameLists: [0],
      i: 0,
      form: {
        resourceName: '',
        resourceValue: ''
      },
      rules: {
        resourceName: [
          {
            validator: checkOrgName1,
            required: true,
            trigger: 'blur'
          }
        ],
        resourceValue: {
          validator: checkOrgName1,
          required: true,
          trigger: 'blur'
        }
      },

      dialogRootRules: {
        resourceName: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'blur'
          }
        ],
        resourceKey: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'blur'
          }
        ],
        resourceValue: {
          message: '此为必填项。',
          required: true,
          trigger: 'blur'
        }
      },
      dialogRules: {
        resourceType: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'change'
          }
        ],
        groupName: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'blur'
          }
        ],
        resourceName: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'blur'
          }
        ],
        resourceKey: [
          {
            message: '此为必填项。',
            required: true,
            trigger: 'blur'
          }
        ],
        resourceValue: {
          message: '此为必填项。',
          required: true,
          trigger: 'blur'
        },
        resourcePid: {
          required: true,
          message: '此为必填项。',
          trigger: 'change'
        }
      },
      treeData: [],
      treeList: [],
      treeList1: [],
      List: '',
      Ids: [],
      Id: '',
      fatherId: '',
      fatherName: '',
      dialogParamsResourceKey: '',
      defaultProps: {
        children: 'childList',
        label: 'resourceName'
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
    this.getRootList()
  },
  methods: {
    async getRootList() {
      await getRootList()
        .then((res) => {
          if (res.data.code === 0) {
            this.resourceKeyOptions = res.data.data
            this.searchResourceType = res.data.data[0].resourceKey
            this.init(null, res.data.data[0].resourceKey)
            this.initTreeList(res.data.data[0].resourceKey)
            setTimeout(() => {
              this.isShow = true
            }, 100)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    treeSort(val) {
      if (val === 1) {
        this.isClickTreeSort = false
      } else {
        this.isClickTreeSort = true
      }
    },
    changeSort(val, data) {
      console.log(data, 9999999)
      if (val === 0) {
        moveResourceXd({
          id: data.id,
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
          this.init(null, this.searchResourceType)
        })
      } else {
        moveResourceXd({
          id: data.id,
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
          this.init(null, this.searchResourceType)
        })
      }
    },
    // 点击节点选中
    nodeClickHandle(data) {
      console.log(data, 111111)
      this.dialog.params.resourcePid = data.resourceName
      // this.dialog.params.resourceKey = data.resourceKey
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    changeGroupNameLists(val, name, index) {
      if (name === 'resourceName') {
        this.dialog.params.resourceName[index] = val
      } else {
        this.dialog.params.resourceValue[index] = val
      }
    },
    addProduct: function () {
      this.i++
      this.groupNameLists.push(this.i)
    },
    deleteDate: function (val) {
      //当弹框只剩一个时不可删除
      if (this.groupNameLists.length === 1) {
        this.$message({ type: 'warning', message: '唯一不可删除!' })
        return
      } else {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.groupNameLists.splice(val, 1)
            this.$message({ type: 'success', message: '删除成功!' })
          })
          .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
          })
      }
    },

    changeResourceType(val) {
      this.searchResourceType = val
      this.init(null, val)
      this.initTreeList(val)
    },
    changeDialogResourceType(val) {
      this.dialog.params.resourceType = val
    },

    childClickHandle(data) {
      console.log(data)
      this.fatherId = data.id
      this.fatherName = data.resourceName
      if (data.childList && data.childList.length > 0) {
        this.isMore = true
        this.treeMsg = data.resourceName
      } else {
        this.isMore = false
        this.treeMsg = data.resourceName
      }
      this.detailsId = data.id
      // this.$refs['unitManagementForm'].resetFields()
      this.getUnitDetailsData(data)
    },
    getUnitDetailsData(res) {
      console.log(res)
      this.form.resourceValue = res ? res.resourceValue : ''
      this.form.resourceName = res ? res.resourceName : ''
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

    async initTreeList(resourceType) {
      await getResourceList({
        resourceKey: resourceType,
        isIncludeResource: false
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList1 = [res.data.data]

            // 弹框赋值
            this.dialogParamsResourceKey = res.data.data.resourceKey
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    async init(id, resourceType) {
      console.log(111, id, resourceType)
      await getResourceList({
        resourceKey: resourceType,
        isIncludeResource: true
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList = [res.data.data]
            this.fatherId = res.data.data.id
            this.fatherName = res.data.data.resourceName
            let resData = {}
            if (id !== '' && id !== undefined && id !== null) {
              this.detailsId = id
              resData = this.getDetailsLists(this.treeList, id)
              this.$refs.unitTree.chooseId(id)
              console.log(resData, 1111)
            } else {
              this.detailsId = res.data.data.id
              resData = res.data.data
              setTimeout(() => {
                this.$refs.unitTree.chooseId(res.data.data.id)
              }, 500)

              console.log(resData, 2222)
            }

            this.getUnitDetailsData(resData)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleClose(done) {
      done()
    },
    handleCloseRoot(done) {
      done()
    },

    dialogShow() {
      this.editShow = true
      this.dialog.params = {
        resourcePid: '',
        resourceMap: {},
        // groupName: '',
        resourceName: [],
        resourceType: '',
        // resourceKey: '',
        resourceValue: []
      }

      this.dialog.params.resourcePid = this.fatherName
      // this.dialog.params.resourceKey = this.dialogParamsResourceKey
      this.dialog.show = !this.dialog.show
    },
    dialogRootShow() {
      this.editRootShow = true
      this.dialogRoot.params = {
        resourceName: '',
        resourceKey: '',
        resourceValue: ''
      }
      this.dialogRoot.show = !this.dialogRoot.show
    },
    dialogMoveShow() {
      this.$refs.moveTree.changeMoveTreeShow()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resourceUpdate({ resourceId: this.detailsId, ...this.form }).then(
            (res) => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.$refs.unitTree.chooseId(this.detailsId)
                this.getRootList()
                // this.init(this.detailsId, this.searchResourceType)
              }
            }
          )
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
        resourceDelete([this.detailsId])
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.init(this.detailsId, this.searchResourceType)
              this.initTreeList(this.searchResourceType)
            } else {
              this.$message({
                type: 'warning',
                message: res.data.msg
              })
            }
          })
          .catch((error) => {
            console.log(11111, error)
          })
      })
    },

    submitRoot(formName) {
      this.isClickRoot = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialogRoot.title) {
            case '新建根节点资源':
              resourceRootAdd(this.dialogRoot.params)
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建成功'
                    })
                    this.dialogRoot.show = false
                    this.editRootShow = false
                    this.i = 1
                    this.isClickRoot = false
                    this.getRootList()
                  }
                })
                .catch((error) => {
                  this.isClickRoot = false
                })
              break

            default:
              break
          }
        }
      })
    },
    submit(formName) {
      this.isClick = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '新建资源':
              this.dialog.params.resourcePid = this.Id ? this.Id : this.fatherId

              let resData1 = this.dialog.params.resourceValue
                ? this.dialog.params.resourceValue
                : []
              let resData2 = this.dialog.params.resourceName
                ? this.dialog.params.resourceName
                : []

              let resParamsArray = []
              let resParams = {}
              resData1.forEach((item, index) => {
                resParamsArray.push({ [item]: resData2[index] })
              })
              for (let i = 0; i < resParamsArray.length; i++) {
                const key = Object.keys(resParamsArray[i])
                resParams[key] = resParamsArray[i][key]
              }
              let lastParams = {
                resourceMap: resParams,
                resourcePid: this.dialog.params.resourcePid,
                resourceType: this.dialog.params.resourceType
                // groupName: this.dialog.params.groupName,
                // resourceKey: this.dialog.params.resourceKey
              }
              resourceAdd(lastParams)
                .then((res) => {
                  if (res.data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新建成功'
                    })
                    this.dialog.show = false
                    this.editShow = false
                    this.i = 1
                    this.isClick = false
                    this.init(null, this.searchResourceType)
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
.add_resource {
  margin: 20px;
}
.group_name_lists {
  display: flex;
  justify-content: space-between;
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
      .btn-lists-top {
        padding: 10px 10px 0 10px;
        display: flex;
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
          height: 32px;
        }
      }
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
    width: 386px;
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
