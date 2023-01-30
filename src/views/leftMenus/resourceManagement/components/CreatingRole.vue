<template>
  <div class="creatingRole-content">
    <div class="panel-header-box">
      <div>
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >新建角色</span
        >
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
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="form.params.name"
              placeholder="请输入角色名称"
              style="width: 436px"
            />
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="form.params.description" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div class="box-card1">
        <div class="clearfix1">
          <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
          <span>权限配置</span>
        </div>
        <div class="text item">
          <el-tabs
            v-model="activeName"
            class="f1 f fd-c"
            type="border-card"
            @tab-click="handleClick"
          >
            <el-tab-pane label="系统权限" name="系统权限">
              <div class="left-lists">
                <div class="left-lists-table-menu">
                  <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                  >
                    <el-submenu index="1">
                      <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>菜单权限</span>
                      </template>
                      <el-menu-item-group>
                        <el-menu-item index="1-1">应用</el-menu-item>
                        <el-menu-item index="1-2">配置</el-menu-item>
                        <el-menu-item index="1-3">运维</el-menu-item>
                      </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="2">
                      <i class="el-icon-setting"></i>
                      <span slot="title">部门管理权限</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                      <i class="el-icon-setting"></i>
                      <span slot="title">安防区域权限</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                      <i class="el-icon-setting"></i>
                      <span slot="title">角色范围</span>
                    </el-menu-item>
                  </el-menu>
                </div>

                <div class="left-lists-table-tree">
                  <el-tree
                    :data="data"
                    class="tree"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 3]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                  >
                  </el-tree>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="资源权限" name="资源权限">
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
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="dialog-footer">
          <el-button @click="goback()"
            ><svg-icon class="svg-btn" icon-class="back-svg" />返回</el-button
          >
          <el-button type="primary" @click="save()"
            ><svg-icon class="svg-btn" icon-class="save" />保存</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from '@/components/LineFont'
import pagination from '@/components/Pagination/index.vue'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import { getSysOrgTree } from '@/api/method/role'
export default {
  name: '',
  components: { LineFont, pagination, leftTree },
  data() {
    return {
      form: {
        show: false,
        title: '',
        params: {}
      },
      activeName: '资源权限',
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      checked: false,
      data: [
        {
          id: 1,
          label: '系统管理',
          children: [
            {
              id: 4,
              label: '领域管理',
              children: [
                {
                  id: 9,
                  label: '角色管理',
                  children: [
                    {
                      id: 9 - 1,
                      label: '权限分支1',
                      children: [
                        {
                          id: 9 - 1 - 1,
                          label: '权限细分1'
                        },
                        {
                          id: 9 - 1 - 2,
                          label: '权限细分2'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '客户管理',
          children: [
            {
              id: 5,
              label: '客户信息',
              children: [
                {
                  id: 7,
                  label: '菜单1'
                },
                {
                  id: 8,
                  label: '菜单2'
                }
              ]
            }
          ]
        }
      ],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 0,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ]
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
        },
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
        },
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
        },
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
        },
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
        },
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
        },
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
      isCheckedAll: true,
      previewCheckAll: false,
      playbackCheckAll: false,
      controlCheckAll: false,
      downloadCheckAll: false,
      alarmCheckAll: false,
      previewIndeterminate: false,
      playbackIndeterminate: false,
      controlIndeterminate: false,
      downloadIndeterminate: false,
      alarmIndeterminate: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getSysOrgTree({ id: 1 }).then((res) => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    },
    handleClick(val, event) {},
    goback() {
      this.$router.push({ path: '/roleManagement' })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelectionChange(v) {
      console.log('v', v)
    },
    checkedAll(tableData) {
      this.isCheckedAll = false
      tableData.forEach((item) => {
        item.previewChecked = true
        item.playbackChecked = true
        item.controlChecked = true
        item.downloadChecked = true
        item.alarmChecked = true
      })

      this.previewCheckAll = true
      this.playbackCheckAll = true
      this.controlCheckAll = true
      this.downloadCheckAll = true
      this.alarmCheckAll = true

      // this.$refs.tableChecked.toggleRowSelection(tableData)
    },
    cancellCheckedAll(tableData) {
      this.isCheckedAll = true

      tableData.forEach((item) => {
        item.previewChecked = false
        item.playbackChecked = false
        item.controlChecked = false
        item.downloadChecked = false
        item.alarmChecked = false
      })
      this.previewCheckAll = false
      this.playbackCheckAll = false
      this.controlCheckAll = false
      this.downloadCheckAll = false
      this.alarmCheckAll = false

      this.previewIndeterminate = false
      this.playbackIndeterminate = false
      this.controlIndeterminate = false
      this.downloadIndeterminate = false
      this.alarmIndeterminate = false

      // this.$refs.tableChecked.clearSelection(tableData)
    }, // 预览列选中逻辑
    checkColumnAll(val) {
      // console.log(111, val.column.label)
      // console.log(22, val._self.previewCheckAll)
      switch (val.column.label) {
        case '预览':
          if (val._self.previewCheckAll) {
            this.tableData.forEach((item) => {
              item.previewChecked = true
            })
            this.previewIndeterminate = false
          } else {
            this.tableData.forEach((item) => {
              item.previewChecked = false
            })
            this.previewIndeterminate = false
          }
          break
        case '回放':
          if (val._self.playbackCheckAll) {
            this.tableData.forEach((item) => {
              item.playbackChecked = true
            })
            this.playbackIndeterminate = false
          } else {
            this.tableData.forEach((item) => {
              item.playbackChecked = false
            })
            this.playbackIndeterminate = false
          }
          break
        case '云台控制':
          if (val._self.controlCheckAll) {
            this.tableData.forEach((item) => {
              item.controlChecked = true
            })
            this.controlIndeterminate = false
          } else {
            this.tableData.forEach((item) => {
              item.controlChecked = false
            })
            this.controlIndeterminate = false
          }
          break
        case '录像下载':
          if (val._self.downloadCheckAll) {
            this.tableData.forEach((item) => {
              item.downloadChecked = true
            })
            this.downloadIndeterminate = false
          } else {
            this.tableData.forEach((item) => {
              item.downloadChecked = false
            })
            this.downloadIndeterminate = false
          }
          break
        case '告警下载':
          if (val._self.alarmCheckAll) {
            this.tableData.forEach((item) => {
              item.alarmChecked = true
            })
            this.alarmIndeterminate = false
          } else {
            this.tableData.forEach((item) => {
              item.alarmChecked = false
            })
            this.alarmIndeterminate = false
          }
          break

        default:
          break
      }
    },
    tableCheckboxChange(name, row) {
      console.log('222', row)

      let isAllTrue = ''
      let isAllFalse = ''
      switch (name) {
        case '预览':
          setTimeout(() => {
            isAllTrue = this.tableData.every(
              (item) => item.previewChecked === true
            )
            isAllFalse = this.tableData.every(
              (item) => item.previewChecked === false
            )
            if (isAllTrue) {
              this.previewIndeterminate = false
              this.previewCheckAll = true
            } else if (isAllFalse) {
              this.previewIndeterminate = false
              this.previewCheckAll = false
            } else {
              this.previewCheckAll = false
              this.previewIndeterminate = true
            }
          }, 0)
          break
        case '回放':
          setTimeout(() => {
            isAllTrue = this.tableData.every(
              (item) => item.playbackChecked === true
            )
            isAllFalse = this.tableData.every(
              (item) => item.playbackChecked === false
            )
            if (isAllTrue) {
              this.playbackIndeterminate = false
              this.playbackCheckAll = true
            } else if (isAllFalse) {
              this.playbackIndeterminate = false
              this.playbackCheckAll = false
            } else {
              this.playbackCheckAll = false
              this.playbackIndeterminate = true
            }
          }, 0)
          break
        case '云台控制':
          setTimeout(() => {
            isAllTrue = this.tableData.every(
              (item) => item.controlChecked === true
            )
            isAllFalse = this.tableData.every(
              (item) => item.controlChecked === false
            )
            if (isAllTrue) {
              this.controlIndeterminate = false
              this.controlCheckAll = true
            } else if (isAllFalse) {
              this.controlIndeterminate = false
              this.controlCheckAll = false
            } else {
              this.controlCheckAll = false
              this.controlIndeterminate = true
            }
          }, 0)
          break
        case '录像下载':
          setTimeout(() => {
            isAllTrue = this.tableData.every(
              (item) => item.downloadChecked === true
            )
            isAllFalse = this.tableData.every(
              (item) => item.downloadChecked === false
            )
            if (isAllTrue) {
              this.pdownloadIndeterminate = false
              this.downloadCheckAll = true
            } else if (isAllFalse) {
              this.downloadIndeterminate = false
              this.downloadCheckAll = false
            } else {
              this.downloadCheckAll = false
              this.downloadIndeterminate = true
            }
          }, 0)
          break
        case '告警下载':
          setTimeout(() => {
            isAllTrue = this.tableData.every(
              (item) => item.alarmChecked === true
            )
            isAllFalse = this.tableData.every(
              (item) => item.alarmChecked === false
            )
            if (isAllTrue) {
              this.alarmIndeterminate = false
              this.alarmCheckAll = true
            } else if (isAllFalse) {
              this.alarmIndeterminate = false
              this.alarmCheckAll = false
            } else {
              this.alarmCheckAll = false
              this.alarmIndeterminate = true
            }
          }, 0)
          break

        default:
          break
      }
    },
    previewChecked(row) {
      console.log('1111', row)
      // row.checked=false;
    },
    // 回放列选中逻辑
    playbackCheckAllDetail() {},
    playbackChecked() {},
    // 云台控制列选中逻辑
    controlCheckAllDetail() {},
    controlChecked() {},
    // 下载列选中逻辑
    downloadCheckAllDetail() {},
    downloadChecked() {},
    // 告警列选中逻辑
    alarmCheckAllDetail() {},
    alarmChecked() {}
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-textarea__inner {
  width: 436px;
  height: 90px;
}
.el-menu-vertical-demo {
  border: 1px solid rgba(234, 234, 234, 1);
}
// 去掉顶部线条
.tree {
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }
}
.creatingRole-content {
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
    border: 1px solid #eaeaea;
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
  }

  .activeDiscovery-transfer {
    margin: 20px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .box-card {
    margin: 20px 20px 0 20px;
    .params-form {
    }
    .left-lists {
      display: flex;
      .left-lists-table-menu {
        width: 289px;
      }
      .left-lists-table-tree {
        margin-left: 20px;
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
    }
  }
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
</style>
