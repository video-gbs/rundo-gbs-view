<template>
  <div class="creatingRole-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" />
        <span class="back-title">
          {{ this.$route.query.key === 'add' ? '新建角色' : '编辑角色' }}
        </span>
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
        <span>基本信息</span>
      </div>
      <div class="text item">
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
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="form.params.roleName"
              placeholder="请输入角色名称"
              style="width: 436px"
              clearable
            />
          </el-form-item>

          <el-form-item label="描述" prop="roleDesc">
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
          <el-tabs v-model="activeName" class="f1 f fd-c" type="border-card">
            <el-tab-pane label="系统权限" name="系统权限">
              <div class="left-lists">
                <div class="left-lists-table-menu">
                  <!-- <el-menu
                    :default-active="activeIndex"
                    class="el-menu-vertical-demo"
                  >
                    <el-menu-item>
                      <span slot="title">{{ o.name }}</span>
                    </el-menu-item>
                  </el-menu>-->

                  <el-tabs
                    tab-position="left"
                    class="el-menu-vertical-demo"
                    v-model="activeIndex"
                  >
                    <el-tab-pane
                      v-for="(item, index) in sysTypeOptions"
                      :label="item.label"
                      :value="item.value"
                      :key="item.value"
                      :index="item.active"
                      :lazy="lazyLoading"
                      class="typeTree-pane"
                    >
                      <div class="left-lists-table-tree">
                        <el-tree
                          :ref="`addRoleTree${[index]}`"
                          :data="allTreeData[index]"
                          class="addRoleTree"
                          show-checkbox
                          node-key="id"
                          :props="getDefaultProps(index)"
                          :default-expand-all="true"
                          highlight-current
                          @check-change="handleCheckChange"
                          :default-expanded-keys="expandedList[index]"
                          :default-checked-keys="checkedList[index]"
                        >
                          <span
                            slot-scope="{ node, data }"
                            class="custom-tree-node"
                          >
                            <span>
                              {{ data.orgName || data.areaName || data.name }}
                            </span>
                          </span>
                        </el-tree>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </el-tab-pane>

            <!-- <el-tab-pane label="资源权限" name="资源权限">
              <div class="right-lists">
                <div class="right-lists-table-menu">
                  <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                  >
                    <el-menu-item index="2">
                      <i class="el-icon-menu"></i>
                      <span slot="title">视频资源</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                      <i class="el-icon-setting"></i>
                      <span slot="title">电视墙</span>
                    </el-menu-item>
                  </el-menu>
                </div>
                <div class="right-lists-table-tree">
                  <leftTree :treeData="treeData" />
                </div>

                <div class="right-lists-table">
                  <div class="right-lists-table-div">
                    <el-input
                      placeholder="请输入搜索关键字"
                      suffix-icon="el-icon-search"
                      class="search-input"
                    ></el-input>
                    <el-button
                      v-if="isCheckedAll"
                      type="primary"
                      @click="checkedAll(tableData)"
                      ><svg-icon
                        class="svg-btn"
                        icon-class="checkedAll"
                      />全选</el-button
                    >
                    <el-button
                      v-else
                      type="primary"
                      @click="cancellCheckedAll(tableData)"
                      ><svg-icon
                        class="svg-btn"
                        icon-class="checkedAll"
                      />取消全选</el-button
                    >
                  </div>
                  <el-table
                    ref="tableChecked"
                    class="table-content-bottom"
                    :data="tableData"
                    border
                    :header-cell-style="{
                      background: 'rgba(0, 75, 173, 0.06)',
                      fontSize: '14px',
                      fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
                      fontWeight: 'bold',
                      color: '#333333'
                    }"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column
                      type="index"
                      width="50"
                      align="center"
                      label="序号"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="通道名称"
                      :show-overflow-tooltip="true"
                    />
                    <el-table-column
                      prop="preview"
                      label="预览"
                      :show-overflow-tooltip="true"
                    >
                      <template slot="header" slot-scope="scope">
                        <el-checkbox
                          v-model="previewCheckAll"
                          :scope="scope"
                          :indeterminate="previewIndeterminate"
                          @change="checkColumnAll(scope)"
                          >预览</el-checkbox
                        >
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.previewChecked"
                          @change="tableCheckboxChange('预览', scope.row)"
                          >预览</el-checkbox
                        >
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="playback"
                      label="回放"
                      :show-overflow-tooltip="true"
                    >
                      <template slot="header" slot-scope="scope">
                        <el-checkbox
                          v-model="playbackCheckAll"
                          :indeterminate="playbackIndeterminate"
                          @change="checkColumnAll(scope)"
                          >回放</el-checkbox
                        >
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.playbackChecked"
                          @change="tableCheckboxChange('回放', scope.row)"
                          >回放</el-checkbox
                        >
                      </template>
                    </el-table-column>
                    <el-table-column prop="control" label="云台控制">
                      <template slot="header" slot-scope="scope">
                        <el-checkbox
                          v-model="controlCheckAll"
                          :indeterminate="controlIndeterminate"
                          @change="checkColumnAll(scope)"
                          >云台控制</el-checkbox
                        >
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.controlChecked"
                          @change="tableCheckboxChange('云台控制', scope.row)"
                          >云台控制</el-checkbox
                        >
                      </template>
                    </el-table-column>
                    <el-table-column prop="videoDownload" label="录像下载">
                      <template slot="header" slot-scope="scope">
                        <el-checkbox
                          v-model="downloadCheckAll"
                          :indeterminate="downloadIndeterminate"
                          @change="checkColumnAll(scope)"
                          >录像下载</el-checkbox
                        >
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.downloadChecked"
                          @change="tableCheckboxChange('录像下载', scope.row)"
                          >录像下载</el-checkbox
                        >
                      </template>
                    </el-table-column>
                    <el-table-column prop="alarm" label="告警下载">
                      <template slot="header" slot-scope="scope">
                        <el-checkbox
                          v-model="alarmCheckAll"
                          :indeterminate="alarmIndeterminate"
                          @change="checkColumnAll(scope)"
                          >告警下载</el-checkbox
                        >
                      </template>
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.alarmChecked"
                          @change="tableCheckboxChange('告警下载', scope.row)"
                          >告警下载</el-checkbox
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
            </el-tab-pane>-->
          </el-tabs>
        </div>
        <div class="dialog-footer">
          <el-button @click="goback()">
            <svg-icon class="svg-btn" icon-class="back-svg" />返回
          </el-button>
          <el-button type="primary" @click="save('accountForm')">
            <svg-icon class="svg-btn" icon-class="save" />保存
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from '@/components/LineFont'
import pagination from '@/components/Pagination/index.vue'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import {
  getVideoAraeTree,
  getAppMenuApiTree,
  getDepartmentTree,
  getRoleDetail,
  editRoles,
  addRoles
} from '@/api/method/role'
export default {
  name: '',
  components: { LineFont, pagination, leftTree },
  data() {
    return {
      form: {
        show: false,
        title: '',
        params: {
          roleDesc: '',
          roleName: ''
        }
      },
      activeName: '系统权限',
      // params: {
      //   pageNum: 1,
      //   pageSize: 10,
      //   total: 0
      // },
      activeIndex: 0,
      expandedList: [],
      checkedList: [],
      sysTypeOptions: [
        { label: '应用菜单权限', value: 1, name: '应用菜单权限', active: '1' },
        { label: '配置菜单权限', value: 2, name: '配置菜单权限', active: '2' },
        { label: '运维菜单权限', value: 3, name: '运维菜单权限', active: '3' },
        { label: '部门管理权限', value: 4, name: '部门管理权限', active: '4' },
        { label: '安防区域权限', value: 5, name: '安防区域权限', active: '5' }
      ],
      checked: false,
      // data: [],
      allTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultProps1: {
        children: 'children',
        label: 'areaNames'
      },
      defaultProps2: {
        children: 'children',
        label: 'orgName'
      },
      rules: {
        roleName: {
          required: true,
          max: 32,
          min: 1,
          message: `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          pattern: /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/,
          trigger: 'blur'
        },
        roleDesc: {
          message: '支持最大长度128个字符。',
          trigger: 'blur',
          max: 128
        }
      },
      tableData: [
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1,
          previewChecked: false,
          playbackChecked: false,
          controlChecked: false,
          downloadChecked: false,
          alarmChecked: false
        }
      ],
      lineTitle: {
        title: '未选择列表',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '已选择列表',
        notShowSmallTitle: false
      },
      textStyle: {
        fontSize: '16px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#333333'
      },
      lineBlueStyle: {
        background: 'rgba(30, 86, 160, 1)',
        width: '3px',
        height: '18px'
      },
      appIds: [],
      areaIds: [],
      configIds: [],
      devopsIds: [],
      orgIds: [],
      type: 1,
      lazyLoading: true
    }
  },
  watch: {
    allTreeData: {
      handler(n, o) {},
      deep: true // 深度监听父组件传过来对象变化
    }
  },
  created() {
    if (this.$route.query.key !== 'add') {
      this.getRoleDetail()
    }
    this.init()
  },
  mounted() {
    // this.handleCheckChange()
  },
  methods: {
    async getRoleDetail() {
      await getRoleDetail(this.$route.query.row).then((res) => {
        if (res.code === 0) {
          const {
            roleDesc,
            roleName,
            appIds,
            areaIds,
            configIds,
            devopsIds,
            orgIds
          } = res.data
          this.form.params.roleDesc = roleDesc
          this.form.params.roleName = roleName
          this.appIds = appIds
          this.areaIds = areaIds
          this.configIds = configIds
          this.devopsIds = devopsIds
          this.orgIds = orgIds
          let res1 = []
          let res2 = []
          let res3 = []
          appIds.map((item1) => {
            res1.push(Number(item1.slice(2)))
          })
          configIds.map((item2) => {
            res2.push(Number(item2.slice(2)))
          })
          devopsIds.map((item3) => {
            res3.push(Number(item3.slice(2)))
          })
          ;(this.expandedList[0] = res1),
            (this.expandedList[1] = res2),
            (this.expandedList[2] = res3),
            (this.expandedList[3] = orgIds),
            (this.expandedList[4] = areaIds),
            (this.checkedList[0] = res1),
            (this.checkedList[1] = res2),
            (this.checkedList[2] = res3),
            (this.checkedList[3] = orgIds),
            (this.checkedList[4] = areaIds)
        }
      })
    },

    async init() {
      const tree1 = await getAppMenuApiTree(1)
      const tree2 = await getAppMenuApiTree(2)
      const tree3 = await getAppMenuApiTree(3)
      const tree4 = await getDepartmentTree()
      const tree5 = await getVideoAraeTree()

      // this.$nextTick(() => {
      this.allTreeData[0] = tree1.data ? tree1.data : []
      this.allTreeData[1] = tree2.data ? tree2.data : []

      this.allTreeData[2] = tree3.data ? tree3.data : []
      this.allTreeData[3] = tree4.data ? tree4.data : []
      this.allTreeData[4] = tree5.data ? tree5.data : []
      // })
      this.lazyLoading = false
    },

    handleCheckChange(data, checked, indeterminate) {
      //获取所有选中的节点 start
      let resIds = []
      const num = Number(this.activeIndex)
      switch (num) {
        case 0:
          let res = this.$refs.addRoleTree0[0].getCheckedNodes()
          res.forEach((item) => {
            resIds.push(item.idStr)
          })
          this.appIds = resIds
          this.expandedList[num] = resIds
          this.checkedList[num] = resIds
          break
        case 1:
          let res1 = this.$refs.addRoleTree1[0].getCheckedNodes()
          res1.forEach((item) => {
            resIds.push(item.idStr)
          })
          this.configIds = resIds
          this.expandedList[num] = resIds
          this.checkedList[num] = resIds
          break
        case 2:
          let res2 = this.$refs.addRoleTree2[0].getCheckedNodes()
          res2.forEach((item) => {
            resIds.push(item.idStr)
          })
          this.devopsIds = resIds
          this.expandedList[num] = resIds
          this.checkedList[num] = resIds
          break
        case 3:
          let res3 = this.$refs.addRoleTree3[0].getCheckedNodes()
          res3.forEach((item) => {
            resIds.push(item.id)
          })
          this.orgIds = resIds
          this.expandedList[num] = resIds
          this.checkedList[num] = resIds
          break
        case 4:
          let res4 = this.$refs.addRoleTree4[0].getCheckedNodes()
          res4.forEach((item) => {
            resIds.push(item.id)
          })
          this.areaIds = resIds
          this.expandedList[num] = resIds
          this.checkedList[num] = resIds
          break
        default:
          break
      }
    },
    async getVideoAraeTree() {
      await getVideoAraeTree().then((res) => {
        if (res.code === 0) {
          this.treeData = res.data
        }
      })
    },
    async getDepartmentTree() {
      await getDepartmentTree().then((res) => {
        if (res.code === 0) {
          this.treeData = res.data
        }
      })
    },
    getDefaultProps(index) {
      if (index === 0 || index === 1 || index === 2) {
        return this.defaultProps
      } else if (index === 3) {
        return this.defaultProps2
      } else {
        return this.defaultProp1
      }
    },
    goback() {
      this.$router.push({ path: '/roleManagement' })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.$route.query.key) {
            case 'add':
              const params = {
                appIds: this.appIds,
                areaIds: this.areaIds,
                configIds: this.configIds,
                devopsIds: this.devopsIds,
                orgIds: this.orgIds,
                roleDesc: this.form.params.roleDesc,
                roleName: this.form.params.roleName
              }
              addRoles(params).then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '角色新建成功'
                  })
                  this.goback()
                }
              })
              break
            case 'edit':
              const params1 = {
                appIds: this.appIds,
                areaIds: this.areaIds,
                configIds: this.configIds,
                devopsIds: this.devopsIds,
                orgIds: this.orgIds,
                roleDesc: this.form.params.roleDesc,
                roleName: this.form.params.roleName
              }
              editRoles({ id: this.$route.query.row, ...params1 }).then(
                (res) => {
                  if (res.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '修改角色成功'
                    })
                    this.goback()
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
    // checkedAll(tableData) {
    //   this.isCheckedAll = false
    //   tableData.forEach((item) => {
    //     item.previewChecked = true
    //     item.playbackChecked = true
    //     item.controlChecked = true
    //     item.downloadChecked = true
    //     item.alarmChecked = true
    //   })

    //   this.previewCheckAll = true
    //   this.playbackCheckAll = true
    //   this.controlCheckAll = true
    //   this.downloadCheckAll = true
    //   this.alarmCheckAll = true
    // },
    // cancellCheckedAll(tableData) {
    //   this.isCheckedAll = true

    //   tableData.forEach((item) => {
    //     item.previewChecked = false
    //     item.playbackChecked = false
    //     item.controlChecked = false
    //     item.downloadChecked = false
    //     item.alarmChecked = false
    //   })
    //   this.previewCheckAll = false
    //   this.playbackCheckAll = false
    //   this.controlCheckAll = false
    //   this.downloadCheckAll = false
    //   this.alarmCheckAll = false

    //   this.previewIndeterminate = false
    //   this.playbackIndeterminate = false
    //   this.controlIndeterminate = false
    //   this.downloadIndeterminate = false
    //   this.alarmIndeterminate = false

    //   // this.$refs.tableChecked.clearSelection(tableData)
    // },
    // 预览列选中逻辑
    // checkColumnAll(val) {
    //   switch (val.column.label) {
    //     case '预览':
    //       if (val._self.previewCheckAll) {
    //         this.tableData.forEach((item) => {
    //           item.previewChecked = true
    //         })
    //         this.previewIndeterminate = false
    //       } else {
    //         this.tableData.forEach((item) => {
    //           item.previewChecked = false
    //         })
    //         this.previewIndeterminate = false
    //       }
    //       break
    //     case '回放':
    //       if (val._self.playbackCheckAll) {
    //         this.tableData.forEach((item) => {
    //           item.playbackChecked = true
    //         })
    //         this.playbackIndeterminate = false
    //       } else {
    //         this.tableData.forEach((item) => {
    //           item.playbackChecked = false
    //         })
    //         this.playbackIndeterminate = false
    //       }
    //       break
    //     case '云台控制':
    //       if (val._self.controlCheckAll) {
    //         this.tableData.forEach((item) => {
    //           item.controlChecked = true
    //         })
    //         this.controlIndeterminate = false
    //       } else {
    //         this.tableData.forEach((item) => {
    //           item.controlChecked = false
    //         })
    //         this.controlIndeterminate = false
    //       }
    //       break
    //     case '录像下载':
    //       if (val._self.downloadCheckAll) {
    //         this.tableData.forEach((item) => {
    //           item.downloadChecked = true
    //         })
    //         this.downloadIndeterminate = false
    //       } else {
    //         this.tableData.forEach((item) => {
    //           item.downloadChecked = false
    //         })
    //         this.downloadIndeterminate = false
    //       }
    //       break
    //     case '告警下载':
    //       if (val._self.alarmCheckAll) {
    //         this.tableData.forEach((item) => {
    //           item.alarmChecked = true
    //         })
    //         this.alarmIndeterminate = false
    //       } else {
    //         this.tableData.forEach((item) => {
    //           item.alarmChecked = false
    //         })
    //         this.alarmIndeterminate = false
    //       }
    //       break

    //     default:
    //       break
    //   }
    // },
    // tableCheckboxChange(name, row) {

    //   let isAllTrue = ''
    //   let isAllFalse = ''
    //   switch (name) {
    //     case '预览':
    //       setTimeout(() => {
    //         isAllTrue = this.tableData.every(
    //           (item) => item.previewChecked === true
    //         )
    //         isAllFalse = this.tableData.every(
    //           (item) => item.previewChecked === false
    //         )
    //         if (isAllTrue) {
    //           this.previewIndeterminate = false
    //           this.previewCheckAll = true
    //         } else if (isAllFalse) {
    //           this.previewIndeterminate = false
    //           this.previewCheckAll = false
    //         } else {
    //           this.previewCheckAll = false
    //           this.previewIndeterminate = true
    //         }
    //       }, 0)
    //       break
    //     case '回放':
    //       setTimeout(() => {
    //         isAllTrue = this.tableData.every(
    //           (item) => item.playbackChecked === true
    //         )
    //         isAllFalse = this.tableData.every(
    //           (item) => item.playbackChecked === false
    //         )
    //         if (isAllTrue) {
    //           this.playbackIndeterminate = false
    //           this.playbackCheckAll = true
    //         } else if (isAllFalse) {
    //           this.playbackIndeterminate = false
    //           this.playbackCheckAll = false
    //         } else {
    //           this.playbackCheckAll = false
    //           this.playbackIndeterminate = true
    //         }
    //       }, 0)
    //       break
    //     case '云台控制':
    //       setTimeout(() => {
    //         isAllTrue = this.tableData.every(
    //           (item) => item.controlChecked === true
    //         )
    //         isAllFalse = this.tableData.every(
    //           (item) => item.controlChecked === false
    //         )
    //         if (isAllTrue) {
    //           this.controlIndeterminate = false
    //           this.controlCheckAll = true
    //         } else if (isAllFalse) {
    //           this.controlIndeterminate = false
    //           this.controlCheckAll = false
    //         } else {
    //           this.controlCheckAll = false
    //           this.controlIndeterminate = true
    //         }
    //       }, 0)
    //       break
    //     case '录像下载':
    //       setTimeout(() => {
    //         isAllTrue = this.tableData.every(
    //           (item) => item.downloadChecked === true
    //         )
    //         isAllFalse = this.tableData.every(
    //           (item) => item.downloadChecked === false
    //         )
    //         if (isAllTrue) {
    //           this.pdownloadIndeterminate = false
    //           this.downloadCheckAll = true
    //         } else if (isAllFalse) {
    //           this.downloadIndeterminate = false
    //           this.downloadCheckAll = false
    //         } else {
    //           this.downloadCheckAll = false
    //           this.downloadIndeterminate = true
    //         }
    //       }, 0)
    //       break
    //     case '告警下载':
    //       setTimeout(() => {
    //         isAllTrue = this.tableData.every(
    //           (item) => item.alarmChecked === true
    //         )
    //         isAllFalse = this.tableData.every(
    //           (item) => item.alarmChecked === false
    //         )
    //         if (isAllTrue) {
    //           this.alarmIndeterminate = false
    //           this.alarmCheckAll = true
    //         } else if (isAllFalse) {
    //           this.alarmIndeterminate = false
    //           this.alarmCheckAll = false
    //         } else {
    //           this.alarmCheckAll = false
    //           this.alarmIndeterminate = true
    //         }
    //       }, 0)
    //       break

    //     default:
    //       break
    //   }
    // },
    // previewChecked(row) {
    //   console.log('1111', row)
    // },
    // // 回放列选中逻辑
    // playbackCheckAllDetail() {},
    // playbackChecked() {},
    // 云台控制列选中逻辑
    // controlCheckAllDetail() {},
    // controlChecked() {},
    // 下载列选中逻辑
    // downloadCheckAllDetail() {},
    // downloadChecked() {},
    // 告警列选中逻辑
    // alarmCheckAllDetail() {},
    // alarmChecked() {}
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-textarea__inner {
  width: 436px;
  height: 90px;
}
.el-menu-vertical-demo {
  max-height: 500px;
  border: 1px solid rgba(234, 234, 234, 1);
}

.creatingRole-content {
  height: calc(100% - 16px);
  overflow-y: auto;
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
      width: 30px;
      height: 30px;
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
      max-height: 480px;
      .left-lists-table-menu {
        text-align: center;
      }
      .left-lists-table-tree {
        margin-left: 20px;
        .addRoleTree {
          max-height: 440px;
          width: 300px;
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
    .text {
      margin-top: 20px;
      height: 440px;
      overflow: auto;
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
.dialog-footer {
  width: 100%;
  height: 52px;
  line-height: 52px;
  margin-top: 20px;
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
    height: 500px;
  }
}
</style>
