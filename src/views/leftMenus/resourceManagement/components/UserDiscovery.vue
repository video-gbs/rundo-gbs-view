<template>
  <div class="activeDiscovery-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >关联用户</span
        >
      </div>
    </div>
    <div class="activeDiscovery-transfer">
      <div>
        <div class="level">
          <!-- 左边框框 -->
          <div class="transferbox">
            <div class="topbox">
              <LineFont
                :line-title="lineTitle"
                :text-style="textStyle"
                :line-blue-style="lineBlueStyle"
              />
            </div>
            <div class="level searchbox">
              <!-- <el-checkbox v-model="checked" class="table-content-top-check"
                >已勾选 1/{{ tableData.length }}</el-checkbox
              > -->
              <el-input
                placeholder="请输入用户账号"
                class="search-input"
                clearable
                v-model="leftSearchName"
                ><el-button
                  icon="el-icon-search"
                  slot="append"
                  @click="search(1)"
                ></el-button
              ></el-input>
            </div>
            <div class="contont">
              <el-table
                ref="tableLeft"
                class="left-table user-table"
                :data="leftTableData"
                border
                :header-cell-style="{
                  background: 'rgba(0, 75, 173, 0.06)',
                  fontSize: '14px',
                  fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
                  fontWeight: 'bold',
                  color: '#333333'
                }"
                @select="selectRows('left')"
              >
                <el-table-column type="selection" width="80" align="center">
                </el-table-column>
                <el-table-column
                  type="index"
                  width="50"
                  align="center"
                  label="序号"
                >
                </el-table-column>
                <el-table-column
                  prop="userAccount"
                  label="用户账号"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="userName"
                  label="用户名称"
                  :show-overflow-tooltip="true"
                />
                <el-table-column prop="orgName;" label="所属部门" width="240" />
                <el-table-column width="80" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="viewRolesDetails(scope.row.id)"
                      ><span class="delete-button">查看</span></el-button
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
          <!-- 中间按钮 -->
          <!-- <div class="vertical center3 centrebtn">
            <svg-icon icon-class="right" class="right_svg" @click="Right" />
            <svg-icon icon-class="left" class="left_svg" @click="Left" />
          </div> -->
          <div class="vertical center3 centrebtn">
            <svg-icon
              :icon-class="isRightClicked ? 'unClickRight' : 'clickRight'"
              class="right_svg"
              @click="isRightClicked ? '' : Right()"
            />
            <svg-icon
              :icon-class="isLeftClicked ? 'unClickLeft' : 'clickLeft'"
              class="left_svg"
              @click="isLeftClicked ? '' : Left()"
            />
          </div>
          <!-- 右边框框 -->
          <div class="transferbox">
            <div class="topbox">
              <LineFont
                :line-title="lineTitle1"
                :text-style="textStyle"
                :line-blue-style="lineBlueStyle"
              />
            </div>
            <div class="level searchbox">
              <!-- <el-checkbox v-model="checked" class="table-content-top-check"
                >已勾选 1/{{ tableData.length }}</el-checkbox
              > -->
              <el-input
                placeholder="请输入用户账号"
                class="search-input"
                clearable
                v-model="rightSearchName"
                ><el-button
                  icon="el-icon-search"
                  slot="append"
                  @click="search(2)"
                ></el-button
              ></el-input>
            </div>

            <div style="padding: 10px" class="contont">
              <el-table
                ref="tableRight"
                class="right-table user-table"
                :data="rightTableData"
                border
                :header-cell-style="{
                  background: 'rgba(0, 75, 173, 0.06)',
                  fontSize: '14px',
                  fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
                  fontWeight: 'bold',
                  color: '#333333'
                }"
                @select="selectRows('right')"
              >
                <el-table-column type="selection" width="80" align="center">
                </el-table-column>
                <el-table-column
                  type="index"
                  width="50"
                  align="center"
                  label="序号"
                >
                </el-table-column>
                <el-table-column
                  prop="userAccount"
                  label="用户账号"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="userName"
                  label="用户名称"
                  :show-overflow-tooltip="true"
                />
                <el-table-column prop="orgName;" label="所属部门" width="240" />
              </el-table>

              <pagination
                :pages-data="params1"
                @size-change="sizeChange1"
                @current-change="currentChange1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="dialog-footer">
      <el-button @click="goback()"
        ><svg-icon class="svg-btn" icon-class="back-svg" />返回</el-button
      >
      <el-button type="primary" @click="save()"
        ><svg-icon class="svg-btn" icon-class="save" />保存</el-button
      >
    </div> -->

    <el-dialog :title="dialog.title" :visible.sync="dialog.show" width="600px">
      <div>
        <el-form
          ref="roleForm"
          class="params-form"
          size="mini"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          @keyup.enter="submit('roleForm')"
        >
          <el-form-item label="用户账号">
            <span>{{ dialog.params.userAccount }}</span>
          </el-form-item>
          <el-form-item label="用户姓名">
            <span>{{ dialog.params.userName }}</span>
          </el-form-item>
          <el-form-item label="所属部门">
            <span>{{ dialog.params.orgName }}</span>
          </el-form-item>
          <el-form-item label="有效日期">
            <span
              >{{ dialog.params.expiryDateStart }}~{{
                dialog.params.expiryDateEnd
              }}</span
            >
          </el-form-item>
          <el-form-item label="用户工号">
            <span>{{ dialog.params.jobNo }}</span>
          </el-form-item>
          <el-form-item label="手机号码">
            <span>{{ dialog.params.phone }}</span>
          </el-form-item>
          <el-form-item label="地址">
            <span>{{ dialog.params.naaddressme }}</span>
          </el-form-item>
          <el-form-item label="功能角色">
            <span>{{ dialog.params.roleName }}</span>
          </el-form-item>
          <el-form-item label="安防区域">
            <span>{{ dialog.params.areaName }}</span>
          </el-form-item>
          <el-form-item label="描述">
            <span>{{ dialog.params.description }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const defaultListQuery = {
  SkipCount: 0,
  MaxResultCount: 20
}
import LineFont from '@/components/LineFont'
import pagination from '@/components/Pagination/index.vue'

import {
  getRelationSysUserInfoList,
  getRelationSysUserInfo,
  getRelationUserByRole,
  addRelationLists,
  removeRelationLists
} from '@/api/method/role'
export default {
  name: '',
  components: { LineFont, pagination },
  data() {
    return {
      form: {},
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      params1: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isRightClicked: true,
      isLeftClicked: true,
      rightSearchName: '',
      leftSearchName: '',
      dialog: {
        show: false,
        title: '查看',
        params: {
          address: '',
          areaName: '',
          description: '',
          email: '',
          orgName: '',
          phone: '',
          roleName: '',
          userName: ''
        }
      },
      checked: false,
      leftTableData: [],
      rightTableData: [],
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
      }
    }
  },
  mounted() {
    this.leftInit()
    this.rightInit()
  },
  methods: {
    search(val) {
      if (val === 1) {
        this.params.pageNum = 1
        this.leftInit()
      } else {
        this.params1.pageNum = 1
        this.rightInit()
      }
    },
    async leftInit() {
      await getRelationSysUserInfoList({
        current: this.params.pageNum,
        pageSize: this.params.pageSize,
        userAccount: this.leftSearchName
      })
        .then((res) => {
          if (res.code === 0) {
            this.leftTableData = res.data.records
            this.params.total = res.data.total
            this.params.pages = res.data.pages
            this.params.current = res.data.current
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async rightInit() {
      await getRelationUserByRole({
        current: this.params1.pageNum,
        pageSize: this.params1.pageSize,
        userAccount: this.rightSearchName,
        roleId: this.$router.currentRoute.query.key
      })
        .then((res) => {
          if (res.code === 0) {
            this.rightTableData = res.data.records
            this.params1.total = res.data.total
            this.params1.pages = res.data.pages
            this.params1.current = res.data.current
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.leftInit()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.leftInit()
    },
    sizeChange1(pageSize) {
      this.params1.pageSize = pageSize
      this.rightInit()
    },
    currentChange1(proCount) {
      this.params1.proCount = proCount
      this.rightInit()
    },
    viewRolesDetails(id) {
      this.dialog.show = true
      getRelationSysUserInfo(id)
        .then((res) => {
          if (res.code === 0) {
            const {
              address,
              areaName,
              description,
              email,
              orgName,
              phone,
              roleName,
              userName,
              userAccount,
              jobNo,
              expiryDateEnd,
              expiryDateStart
            } = res.data
            this.dialog.params.address = address
            this.dialog.params.areaName = areaName
            this.dialog.params.description = description
            this.dialog.params.email = email
            this.dialog.params.orgName = orgName
            this.dialog.params.phone = phone
            this.dialog.params.roleName = roleName
            this.dialog.params.userName = userName
            this.dialog.params.userAccount = userAccount
            this.dialog.params.jobNo = jobNo
            this.dialog.params.expiryDateStart = expiryDateStart
            this.dialog.params.expiryDateEnd = expiryDateEnd
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    goback() {
      this.$router.push({ path: '/roleManagement' })
    },
    //数组去重
    fn2(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, arr.id))
    },
    selectRows(val) {
      if (val === 'left') {
        if (this.$refs.tableLeft.selection.length === 0) {
          this.isRightClicked = true
        } else {
          this.isRightClicked = false
        }
      } else {
        if (this.$refs.tableRight.selection.length === 0) {
          this.isLeftClicked = true
        } else {
          this.isLeftClicked = false
        }
      }
    },
    //左到右
    Right() {
      if (this.$refs.tableLeft.selection.length === 0) {
        this.$message({
          message: '请勾选左边的模块',
          type: 'warning'
        })
        return
      } else {
        this.rightTableData = this.rightTableData
          ? this.rightTableData
          : [].concat(this.$refs.tableLeft.selection)
        // 复制数组对象
        let selectLeftList = JSON.parse(
          JSON.stringify(this.$refs.tableLeft.selection)
        )
        selectLeftList.forEach((item) => {
          let index = this.leftTableData.findIndex(
            (_item) => _item.id === item.id
          )
          if (index !== undefined) {
            this.leftTableData.splice(index, 1)
          }
        })
        this.$refs.tableLeft.clearSelection()

        let userIdList = []
        selectLeftList.map((item) => {
          userIdList.push(item.id)
        })

        addRelationLists({
          userIdList,
          roleId: this.$router.currentRoute.query.key
        }).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '关联成功'
            })
            this.params1.pageSize = 1
            this.rightInit()
          }
        })
      }
    },
    //右到左
    Left() {
      if (this.$refs.tableRight.selection.length === 0) {
        this.$message({
          message: '请勾选右边的模块',
          type: 'warning'
        })
        return
      } else {
        this.leftTableData = this.leftTableData
          ? this.leftTableData
          : [].concat(this.$refs.tableRight.selection)
        // 复制数组对象
        let selectRightList = JSON.parse(
          JSON.stringify(this.$refs.tableRight.selection)
        )
        selectRightList.forEach((item) => {
          let index = this.rightTableData.findIndex(
            (_item) => _item.id === item.id
          )
          if (index !== undefined) {
            this.rightTableData.splice(index, 1)
          }
        })
        this.$refs.tableRight.clearSelection()

        let userIdList1 = []
        selectRightList.map((item) => {
          userIdList1.push(item.id)
        })

        removeRelationLists({
          userIdList: userIdList1,
          roleId: this.$router.currentRoute.query.key
        }).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '解除管理用户成功'
            })
            this.params1.pageSize = 1
            this.rightInit()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
}
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
::v-deep .el-dialog {
  margin-top: 4vh !important;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
// 滚动条大小设置
::v-deep .user-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .user-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .user-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .user-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.detail-row {
  margin-bottom: 25px;

  .detail {
    border-left: solid #ccc 1px;

    ::v-deep .el-form-item {
      margin: 0;
      background: #f7f7f7;

      label {
        padding: 5px 8px;
        border-top: solid #ccc 1px;
      }

      .el-form-item__content {
        padding-left: 8px;
        padding-top: 5px;
        background: white;
        border-left: solid #ccc 1px;
        border-top: solid #ccc 1px;
      }
    }
  }
  .detail.row-end ::v-deep .el-form-item__content {
    border-right: solid #ccc 1px;
  }
  .detail.row-bottom {
    border-bottom: solid #ccc 1px;
  }
}
///@at-root
///
.left-table {
  height: calc(100% - 100px);
  overflow-y: auto;
}
.right-table {
  height: calc(100% - 100px);
  overflow-y: auto;
}
.transferbox {
  max-height: 730px;
  width: 45%; //右边盒子的宽占比
  border: 1px solid#ebedf2;
  margin-top: 16px;

  .topbox {
    border-bottom: 1px solid #ebedf2;
    padding: 0px 10px;
    color: #575962;
    font-size: 16px;
    font-weight: 550;
  }
  .searchbox {
    display: flex;
    justify-content: space-between;
    margin: 10px;
    .table-content-top-check {
      padding: 10px 10px 0 10px;
    }
    .search-input {
      width: 286px;
    }
    // float: right;
  }
  .contont {
    height: 100%;
  }
}
.centrebtn {
  width: 80px;
  height: 600px;
  margin: 0 10px 0 10px;
  color: #ffff;
  .right_svg {
    width: 24px;
    height: 24px;
    margin-bottom: 44px;
    cursor: pointer;
  }
  .left_svg {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
/* 水平居中 */
.center1 {
  display: flex;
  justify-content: center;
}

/* 垂直水平居中 */
.center3 {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 水平布局 */
.level {
  display: flex;
  flex-direction: row;
  margin: 16px;
}
// 垂直布局
.vertical {
  display: flex;
  flex-direction: column;
}

.contont {
  padding: 10px;
}
::v-deep .contont .el-checkbox {
  display: block;
}
.activeDiscovery-content {
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
    height: calc(100% - 86px);
    margin: 20px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
}
.dialog-footer {
  width: 100%;
  height: 52px;
  line-height: 52px;
  margin-top: 20px;

  position: absolute;
  bottom: 15px;

  right: 10px;
  text-align: right;
  // border-top: 1px solid #eaeaea;
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
