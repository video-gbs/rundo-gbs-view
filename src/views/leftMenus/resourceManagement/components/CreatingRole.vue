<template>
  <div class="creatingRole-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back-svg" @click="goback" />
        <span class="back-title">{{
          nameType === 'add' ? '新建角色' : '编辑角色'
        }}</span>
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="jibenxinxi" class="pjqktj_svg" />
        <span>基本信息</span>
      </div>
      <div class="text item" style="margin-top: 18px">
        <el-form
          ref="accountForm"
          class="params-form"
          size="mini"
          label-position="right"
          label-width="80px"
          :model="form.params"
          :rules="rules"
          @keyup.enter="submit('accountForm')"
        >
          <el-form-item
            label="角色名称"
            prop="roleName"
            style="margin-bottom: 40px"
          >
            <el-input
              v-model="form.params.roleName"
              placeholder="请输入角色名称"
              style="width: 436px"
              clearable
            />
          </el-form-item>

          <el-form-item
            label="描述"
            prop="roleDesc"
            style="margin-bottom: 50px"
          >
            <el-input v-model="form.params.roleDesc" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div class="box-card1">
        <div class="clearfix1">
          <svg-icon icon-class="qxpz" class="pjqktj_svg" />
          <span>权限配置</span>
        </div>
        <div class="text item tree-bottom">
          <div class="btn-lists-top" v-if="activeIndex !== '应用菜单权限'">
            <el-select
              class="btn-lists-top-select"
              v-model="resourceKey"
              placeholder="请选择资源类型："
              @change="changeResourceType"
            >
              <el-option
                v-for="o in resourceKeyOptions"
                :label="o.resourceName"
                :value="o.resourceKey"
                :key="o.resourceValue"
              />
            </el-select>
          </div>
          <el-tabs
            v-model="activeName"
            class="f1 f fd-c top-pane"
            type="border-card"
          >
            <el-tab-pane label="系统权限" name="系统权限" class="role-pane">
              <div class="left-lists">
                <div class="left-lists-table-menu">
                  <el-tabs
                    class="el-menu-vertical-demo"
                    v-model="activeIndex"
                    tab-position="left"
                    @tab-click="handleClick"
                  >
                    <el-tab-pane
                      class="typeTree-pane"
                      label="应用菜单权限"
                      name="应用菜单权限"
                    >
                      <div
                        class="left-lists-table-tree left-lists-table-tree-menu"
                      >
                        <el-tree
                          ref="addRoleTree1"
                          :data="treeData1"
                          class="addRoleTree"
                          show-checkbox
                          node-key="id"
                          :props="defaultProps"
                          :expand-on-click-node="false"
                          :check-strictly="true"
                          :default-expand-all="true"
                          highlight-current
                          @node-click="nodeClickHandle"
                          @check-change="handleCheckChange"
                          :default-expanded-keys="expandedList1"
                          :default-checked-keys="checkedList1"
                        >
                          <span
                            slot-scope="{ node, data }"
                            class="custom-tree-node"
                          >
                            <span>{{ data.name }}</span>
                          </span>
                        </el-tree>
                        <div class="role_featureApiTable">
                          <el-table
                            v-if="isLeftChecked"
                            ref="featureApiTable"
                            class="table-content-bottom"
                            :data="featureApiTableData"
                            row-key="id"
                            @selection-change="handleSelectChange"
                            @select="handleSelect"
                            border
                            :header-cell-style="{
                              background: 'rgba(0, 75, 173, 0.06)',
                              fontSize: '14px',
                              fontFamily:
                                'Microsoft YaHei-Bold, Microsoft YaHei',
                              fontWeight: 'bold',
                              color: '#333333'
                            }"
                          >
                            <el-table-column
                              type="selection"
                              width="80"
                              align="center"
                            >
                            </el-table-column>
                            <el-table-column
                              type="index"
                              width="50"
                              align="center"
                              label="序号"
                            >
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
                                <span
                                  v-for="item in methodOptions"
                                  :key="item.value"
                                  >{{
                                    item.value === scope.row.method
                                      ? item.label
                                      : ''
                                  }}</span
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
                      </div>
                    </el-tab-pane>
                    <el-tab-pane
                      class="typeTree-pane"
                      label="资源功能权限"
                      name="资源功能权限"
                    >
                      <div class="left-lists-table-tree">
                        <el-tree
                          :ref="'addRoleTree2' + resourceKey"
                          :data="treeData2[resourceKey]"
                          class="addRoleTree"
                          show-checkbox
                          node-key="id"
                          :props="defaultProps1"
                          :expand-on-click-node="false"
                          :check-strictly="true"
                          :default-expand-all="true"
                          highlight-current
                          @check-change="handleCheckChange"
                          :default-expanded-keys="expandedList2[resourceKey]"
                          :default-checked-keys="checkedList2[resourceKey]"
                        >
                          <span
                            slot-scope="{ node, data }"
                            class="custom-tree-node"
                          >
                            <span>{{ data.resourceName }}</span>
                          </span>
                        </el-tree>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>

    <div class="dialog-footer">
      <el-button @click="goback()">
        <svg-icon class="svg-btn" icon-class="back-svg" />返回
      </el-button>
      <el-button type="primary" @click="save('accountForm')">
        <svg-icon class="svg-btn" icon-class="save" />保存
      </el-button>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import {
  getVideoAraeTree,
  getAppMenuApiTree,
  getDepartmentTree,
  roleUpdate,
  roleAdd,
  getRoleMenuList,
  getRoleResourceList,
  getRoleFuncMenuList,
  getRoleFuncList,
  getRoleResourceTreeNew,
  getRoleResourceRootNew
} from '@/api/method/role'

// import { getRootList } from '@/api/method/resourceInterface'

import { getMenuTree } from '@/api/method/menus'

import { getFeatureList } from '@/api/method/featureApi'

export default {
  name: '',
  components: { pagination, leftTree },
  props: ['creatingRoleRow', 'nameType'],
  data() {
    const checkRoleName = (rule, value, cb) => {
      const regRoleName = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regRoleName.test(value)) {
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
      form: {
        show: false,
        title: '',
        params: {
          roleDesc: '',
          roleName: ''
        }
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      featureApiTableData: [],
      isLeftChecked: true,
      resourceKey: '',
      resourceKeyOptions: [],
      activeName: '系统权限',
      ischeckStrictly: [false, false, false, true, true],
      activeIndex: '应用菜单权限',
      expandedList1: [],
      checkedList1: [],
      expandedList2: {},
      checkedList2: {},
      checked: false,
      treeData1: [],
      treeData2: {},
      methodOptions: [
        { label: 'post', value: 2 },
        { label: 'get', value: 1 },
        { label: 'put', value: 3 },
        { label: 'delete', value: 4 }
      ],
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      defaultProps1: {
        children: 'childList',
        label: 'resourceName'
      },
      rules: {
        roleName: {
          required: true,
          max: 32,
          validator: checkRoleName,
          trigger: 'blur'
        },
        roleDesc: {
          message: '支持最大长度128个字符。',
          trigger: 'blur',
          max: 128
        }
      },
      Id: '',
      selectedObj: {},
      selectedData: [],
      resLists: {},
      // 菜单数组
      menuIds: [],
      // 功能数组
      funcIds: [],
      // 资源数组
      resourceIds: [],
      type: 1,
      allRoleFuncList: [],
      updateRoleResourceList: [],
      updateIdsList: [],
      updateRoleFuncMenuIds: []
    }
  },
  watch: {
    allTreeData: {
      handler(n, o) {
        console.log(n, o)
      },
      deep: true
    }
  },
  created() {
    if (this.$props.nameType !== 'add') {
      const { roleDesc, roleName } = this.$props.creatingRoleRow
      this.form.params.roleDesc = roleDesc
      this.form.params.roleName = roleName

      this.getRoleFuncList()

      this.getRoleMenuList()

      this.getRoleResourceList()
    }
    this.getRootList()
  },
  mounted() {
    this.initGetMenuTree()
  },
  methods: {
    async getRootList() {
      await getRoleResourceRootNew()
        .then((res) => {
          if (res.data.code === 0) {
            this.resourceKeyOptions = res.data.data
            this.resourceKey = res.data.data[0].resourceKey

            this.initGetResourceList(this.resourceKey, false)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleClick(tab, event) {
      if (tab.name === '应用菜单权限') {
        return this.defaultProps
      } else {
        return this.defaultProp1
      }
    },

    // 获取全部的回显应用菜单权限树
    async getRoleFuncList() {
      await getRoleFuncList({ roleId: this.$props.creatingRoleRow.id })
        .then((res) => {
          if (res.data.code === 0) {
            this.allRoleFuncList = res.data.data
            // this.funcIds = res.data.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 回显应用菜单权限树
    async getRoleMenuList() {
      await getRoleMenuList({ roleId: this.$props.creatingRoleRow.id })
        .then((res) => {
          if (res.data.code === 0) {
            this.expandedList1 = res.data.data
            this.checkedList1 = res.data.data
            this.menuIds = res.data.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 回显角色某菜单下的功能信息
    async getRoleFuncMenuList(id) {
      await getRoleFuncMenuList({
        roleId: this.$props.creatingRoleRow.id,
        menuId: id
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.updateRoleFuncMenuIds = res.data.data
            this.getList(id)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 回显资源功能树
    async getRoleResourceList() {
      await getRoleResourceList({
        roleId: this.$props.creatingRoleRow.id
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.updateRoleResourceList = []
            this.updateRoleResourceList = res.data.data
            this.resourceIds = res.data.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 应用菜单树
    async initGetMenuTree() {
      await getMenuTree()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeData1 = [res.data.data]
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 资源功能树
    async initGetResourceList(resourceKey, value) {
      await getRoleResourceTreeNew({
        resourceKey
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$nextTick(() => {
              this.treeData2[resourceKey] = [res.data.data] || []

              if (this.$props.nameType !== 'add') {
                this.handleRowSelection1(
                  this.treeData2[resourceKey],
                  resourceKey
                )
              }
              this.$forceUpdate()
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 处理当前列表选中状态
    handleRowSelection(data) {
      console.log('处理当前列表选中状态', data, this.selectedObj)
      data.forEach((item) => {
        if (this.selectedObj[item.id]) {
          this.$nextTick(() => {
            this.$refs.featureApiTable.toggleRowSelection(item)
            this.$forceUpdate()
          })
        }
      })
    },

    setCheckedLists(arr) {
      arr.map((item) => {
        if (item.id === this.resLists[this.resourceKey][0].id) {
          return item
        } else {
          if (item.childList && item.childList.length > 0) {
            this.setCheckedLists(item.childList)
          }
        }
      })
    },

    // setCheckedLists1(arr, resourceKey) {
    //   arr.map((item) => {
    //     this.updateRoleResourceList.forEach((item1) => {
    //       if (item.id === item1) {
    //         this.updateIdsList.push(item.id)
    //       } else {
    //         if (item.childList && item.childList.length > 0) {
    //           this.setCheckedLists1(item.childList)
    //         }
    //       }
    //     })
    //   })
    // },

    handleRowSelection1(data, resourceKey) {
      // this.setCheckedLists1(data, resourceKey)
      // console.log('this.updateIdsList', this.updateIdsList)
      this.$nextTick(() => {
        this.expandedList2[resourceKey] = this.updateRoleResourceList
        this.checkedList2[resourceKey] = this.updateRoleResourceList
        this.$refs['addRoleTree2' + resourceKey].setCheckedNodes(
          this.updateRoleResourceList
        )
      })
    },

    handleSelectChange(selection) {
      // 全选取消，删除当前页所有数据
      if (selection.length === 0) {
        this.featureApiTableData.forEach((item) => {
          delete this.selectedObj[item.id]
        })
        this.featureApiTableData.forEach((item) => {
          console.log('~~~~~~~~~~~~~~', item)
          this.allRoleFuncList = this.allRoleFuncList.filter((item1) => {
            return item1 !== item.id
          })
        })
      }
      console.log('全部取消~~~~~~~~~~~~~~', this.allRoleFuncList)
      // 勾选数据 添加
      selection.forEach((item) => {
        this.selectedObj[item.id] = item
      })
      // 获取所有分页勾选的数据
      this.selectedData = []
      for (const key in this.selectedObj) {
        this.selectedData.push(this.selectedObj[key])
      }
    },

    handleSelect(selection, row) {
      // 取消单个勾选时，删除对应属性
      if (!selection.some((item) => item.id === row.id)) {
        delete this.selectedObj[row.id]
      }

      console.log('selection', selection, this.selectedObj)
      if (this.$props.nameType !== 'add') {
        let resData = []
        selection.map((item1) => {
          resData.push(item1.id)
        })
        // this.allRoleFuncList = resData

        console.log('resData', resData)

        console.log('this.allRoleFuncList````````', this.allRoleFuncList)
      }
    },

    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList(this.Id)
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList(this.Id)
    },

    changeResourceType(val) {
      this.resourceKey = val
      if (this.$props.nameType !== 'add') {
        this.initGetResourceList(val, true)
      } else {
        this.initGetResourceList(val, false)
      }
    },

    async getList(id) {
      await getFeatureList({
        page: this.params.pageNum,
        num: this.params.pageSize,
        menuId: id,
        isInclude: false
      }).then((res) => {
        if (res.data.code === 0) {
          this.featureApiTableData = res.data.data.list

          if (this.$props.nameType !== 'add') {
            // this.allRoleFuncList = Array.from(
            //   new Set(this.allRoleFuncList.concat(checkedIds))
            // )
            res.data.data.list.map((item) => {
              this.allRoleFuncList.forEach((item1) => {
                if (item.id === item1) {
                  this.selectedObj[item1] = item
                }
              })
            })
          }

          this.handleRowSelection(this.featureApiTableData)
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

    nodeClickHandle(data) {
      if (this.$props.nameType !== 'add') {
        this.getRoleFuncMenuList(data.id)
      } else {
        this.getList(data.id)
      }
      this.Id = data.id
    },

    //递归设置父节点全部选中
    setParentNode(node) {
      if (node.parent) {
        //循环对象的parent属性，设对象节点选择框为选中状态
        for (const key in node) {
          if (key === 'parent') {
            node[key].checked = true
            //递归调用相应父节点处理函数
            this.setParentNode(node[key])
          }
        }
      }
    },
    //递归设置子节点全部取消选中
    setChildNode(node) {
      if (node.childNodes && node.childNodes.length) {
        //将此节点下所有子节点设为选中状态
        node.childNodes.forEach((item) => {
          item.checked = false
          //递归调用相应子节点处理函数
          this.setChildNode(item)
        })
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log('data', data, this.activeIndex)
      // 获取所有选中的节点
      let resIds = []
      switch (this.activeIndex) {
        case '应用菜单权限':
          if (checked === false) {
            //如果当前节点有子集
            if (data.childList) {
              data.childList.map((item1) => {
                this.$refs.addRoleTree1.setChecked(item1.id, false)
              })
            }
          } else {
            //否则(为选中状态)
            //判断父节点id是否为空
            if (data.menuPid) {
              //如果不为空则将其选中
              this.$refs.addRoleTree1.setChecked(data.menuPid, true)
            }
          }
          let res1 = this.$refs.addRoleTree1.getCheckedNodes()
          res1.forEach((item) => {
            resIds.push(item.id)
          })

          this.menuIds = resIds
          this.expandedList1 = resIds
          this.checkedList1 = resIds
          break
        case '资源功能权限':
          if (checked === false) {
            if (data.childList) {
              data.childList.map((item2) => {
                this.$refs['addRoleTree2' + this.resourceKey].setChecked(
                  item2.id,
                  false
                )
              })
            }
          } else {
            if (data.resourcePid) {
              this.$refs['addRoleTree2' + this.resourceKey].setChecked(
                data.resourcePid,
                true
              )
            }
          }
          this.resLists[this.resourceKey] =
            this.$refs['addRoleTree2' + this.resourceKey].getCheckedNodes()

          this.resLists[this.resourceKey].forEach((item) => {
            resIds.push(item.id)
          })
          let resIdLists = []
          this.resourceIds = []
          for (const key in this.resLists) {
            resIdLists.push(this.resLists[key])
          }

          resIdLists.forEach((item1) => {
            item1.map((child) => {
              this.resourceIds.push(child.id)
            })
          })

          this.updateRoleResourceList = []
          this.updateRoleResourceList = this.resourceIds
          // return
          this.expandedList2[this.resourceKey] = resIds
          this.checkedList2[this.resourceKey] = resIds
          break
        default:
          break
      }
    },
    goback() {
      this.$emit('changeIsClicked', 2)
    },

    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.funcIds = []
          this.selectedData.map((item) => {
            this.funcIds.push(item.id)
          })
          this.funcIds = this.allRoleFuncList
            .concat(this.funcIds)
            .filter((item, index, array) => {
              return array.indexOf(item) === index
            })

          console.log('this.funcIds============', this.funcIds)
          switch (this.$props.nameType) {
            case 'add':
              const params = {
                funcIds: this.funcIds,
                menuIds: this.menuIds,
                resourceIds: this.resourceIds,
                ...this.form.params
              }

              console.log('this.params~~~~~~~~~~~~~~~', params)
              // return
              roleAdd(params).then((res) => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '角色新建成功'
                  })

                  this.$emit('getList')
                  this.goback()
                }
              })
              break
            case 'edit':
              const params1 = {
                funcIds: this.funcIds,
                menuIds: this.menuIds,
                resourceIds: this.resourceIds,
                ...this.form.params
              }
              console.log('params1', params1)
              roleUpdate({
                roleId: this.$props.creatingRoleRow.id,
                ...params1
              }).then((res) => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改角色成功'
                  })

                  this.$emit('getList')
                  this.goback()
                }
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
::v-deep .top-pane {
  border: 0 none;
  box-shadow: none;
  height: 100%;
}
::v-deep .top-pane > .el-tabs__header {
  background: #fff;
  border: 0 none;
}
::v-deep .top-pane > .el-tabs__header > .el-tabs__nav-wrap {
  > .el-tabs__nav-scroll {
    &::after {
      content: '';
      position: absolute;
      left: 15px;
      bottom: 0;
      width: 80px;
      height: 2px;
      background-color: #1e56a0;
      z-index: 1;
    }
    > .el-tabs__nav {
      background-color: #1e56a0;
      z-index: 1;
      -webkit-transition: -webkit-transform 0.3s
        cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
        -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      list-style: none;
      > .el-tabs__item {
        background-color: #fff !important;
        font-size: 18px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        border: 0 none;
        color: #0270ff;
        &::after {
          display: none;
        }
      }
    }
  }
  .el-tabs__active-bar {
    margin-left: 16px;
  }
}
::v-deep .el-textarea__inner {
  width: 436px;
  height: 90px;
}

::v-deep .el-card__header {
  padding: 0 20px;
  height: 62px;
}
::v-deep .el-card__body {
  padding-bottom: 0;
  height: calc(100% - 62px);
}
::v-deep .top-pane > .el-tabs__content {
  height: calc(100% - 94px);
}
::v-deep .role-pane {
  max-height: calc(100% - 10px);
  overflow-y: auto;
}

::v-deep .el-menu-vertical-demo > .el-tabs__header {
  border: 1px solid #eaeaea;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  border-right: 0;
  > .el-tabs__nav-wrap {
    padding-top: 0;
  }
}

// 滚动条大小设置
::v-deep .role_featureApiTable::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .role_featureApiTable::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .role_featureApiTable::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .role_featureApiTable::-webkit-scrollbar-corner {
  background-color: #111;
}
.btn-lists-top {
  position: absolute;
  left: 110px;
  top: 5px;
  z-index: 9999999;
  .btn-lists-top-select {
    widows: 436px;
  }
}

.creatingRole-content {
  height: calc(100% - 16px);
  overflow-y: auto;
  position: relative;
  .panel-header-box {
    margin: 0;
    padding: 0 16px;
    border-top: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .back-svg {
      cursor: pointer;
    }
    .back-title {
      position: relative;
      top: 0px;
      left: 10px;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
    }
    .panel-header-box-border {
      border-top: 1px solid #eaeaea;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #011f53;
    }
  }

  .activeDiscovery-transfer {
    margin: 20px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .box-card {
    margin: 20px 20px 0 20px;
    height: calc(100% - 86px);
    .params-form {
    }
    .left-lists {
      display: flex;
      height: calc(100% - 0px);
      width: 100%;
      .left-lists-table-menu {
        height: 100%;
        width: 100%;
        text-align: center;
        .el-menu-vertical-demo {
          height: 100%;
          border: 0 none;
          .el-tabs__content {
          }
        }
      }
      .left-lists-table-tree {
        margin-left: 20px;
        .addRoleTree {
          max-height: 350px;
          width: 300px;
          margin-right: 20px;
          overflow-y: auto;
        }
      }
      .left-lists-table-tree-menu {
        display: flex;
        // justify-content: flex-start;
        .role_featureApiTable {
          width: calc(100% - 300px);
          overflow-y: auto;
        }
      }
    }

    .clearfix {
      height: 80px;
      line-height: 62px;
      span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
      }
      .pjqktj_svg {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        top: 3px;
        left: -3px;
      }
    }
  }
  .box-card1 {
    margin: 0 -20px;
    height: calc(100% - 226px);

    .clearfix1 {
      height: 62px;
      line-height: 62px;
      padding-left: 20px;

      border-bottom: 1px solid #eaeaea;
      span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
      }
      .pjqktj_svg {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        top: 3px;
        left: -3px;
      }
    }
    .right-lists {
      display: flex;
      // justify-content: space-between;
      .right-lists-table-menu {
        width: 289px;
      }
      .right-lists-table-tree {
        width: 289px;
        margin: -20px 40px 0 20px;
      }
      .right-lists-table {
        width: calc(100% - 578px);
        .right-lists-table-div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          .search-input {
            width: 286px;
          }
        }
      }
    }
    .tree-bottom {
      margin-top: 20px;
      height: calc(100% - 82px);
      overflow: auto;
      position: relative;
    }
  }
}

// 滚动条大小设置
::v-deep .tree-bottom::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .tree-bottom::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .tree-bottom::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .tree-bottom::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
::v-deep .el-menu-vertical-demo {
  .el-tabs__content {
    height: 100%;
  }
}
.dialog-footer {
  width: calc(100% + 30px);
  height: 52px;
  line-height: 52px;
  margin-top: 20px;
  position: absolute;
  bottom: 20px;
  right: 16px;
  margin-left: -15px;
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
// 去掉顶部线条
::v-deep .addRoleTree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .addRoleTree > .el-tree-node::before {
  border-left: none;
}
::v-deep .is-active::after {
  display: none;
}

::v-deep .el-menu-vertical-demo {
  .el-tabs__item {
    text-align: center;
    width: 289px;
    height: 53px;
    line-height: 53px;
    font-size: 16px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    padding: 0 !important;
    border-bottom: 1px solid #eaeaea;
  }
  .is-active {
    padding: 0 !important;
  }
}
::v-deep .el-menu-vertical-demo {
  .el-tabs__nav {
    height: 100%;
  }
}
::v-deep .addRoleTree::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .addRoleTree::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .addRoleTree::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .addRoleTree::-webkit-scrollbar-corner {
  background-color: #111;
}
// 滚动条大小设置
::v-deep .role-pane::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .role-pane::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .role-pane::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .role-pane::-webkit-scrollbar-corner {
  background-color: #111;
}
</style>
