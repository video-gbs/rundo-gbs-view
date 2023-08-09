<template>
  <div class="streamMediaAssociated-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back-svg" @click="goback" /><span
          class="back-title"
          >关联</span
        >
      </div>
    </div>
    <div class="streamMediaAssociated-transfer">
      <div class="left-contnet">
        <div class="level" style="height: 100%">
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
              <el-checkbox
                v-model="isRightClicked"
                class="table-content-top-check"
                >已勾选 {{ tableLeftSelectionLength }}/{{
                  params.total
                }}</el-checkbox
              >
              <el-input
                placeholder="请输入模块名称"
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
                class="left-table"
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
                @selection-change="handleSelectionChange"
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
                  prop="name"
                  label="模块名称"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="serialNum"
                  label="序列号"
                  :show-overflow-tooltip="true"
                />
                <el-table-column prop="protocol" label="协议" />
                <el-table-column prop="ip" label="IP" />
              </el-table>

              <pagination
                :pages-data="params"
                @size-change="sizeChange"
                @current-change="currentChange"
              />
            </div>
          </div>
          <!-- 中间按钮 -->
          <div class="vertical center3 centrebtn">
            <svg-icon
              :icon-class="!isRightClicked ? 'unClickRight' : 'clickRight'"
              class="right_svg"
              @click="!isRightClicked ? '' : Right()"
            />
            <svg-icon
              :icon-class="!isLeftClicked ? 'unClickLeft' : 'clickLeft'"
              class="left_svg"
              @click="!isLeftClicked ? '' : Left()"
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
              <el-checkbox
                v-model="isLeftClicked"
                class="table-content-top-check"
                >已勾选 {{ tableRightSelectionLength }}/{{
                  params1.total
                }}</el-checkbox
              >
              <el-input
                placeholder="请输入模块名称"
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
                class="right-table"
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
                @selection-change="handleSelectionChange1"
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
                  prop="name"
                  label="模块名称"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="serialNum"
                  label="序列号"
                  :show-overflow-tooltip="true"
                />
                <el-table-column prop="protocol" label="协议" />
                <el-table-column prop="ip" label="IP" />
              </el-table>

              <pagination
                :pages-data="params1"
                @size-change="sizeChange1"
                @current-change="currentChange1"
              />
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
      </div>
    </div>
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
  getAllUnNorthDispatchLists,
  getAllNorthDispatchLists,
  bindingNorthLists,
  unbindingNorthLists
} from '@/api/method/moduleManagement'

export default {
  name: '',
  components: { LineFont, pagination },
  props: ['streamMediaAssociatedRow'],
  data() {
    return {
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
      rightSearchName: '',
      leftSearchName: '',
      tableLeftSelectionLength: 0,
      tableRightSelectionLength: 0,
      isRightClicked: false,
      isLeftClicked: false,
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
        this.leftInit()
      } else {
        this.rightInit()
      }
    },
    async leftInit() {
      await getAllUnNorthDispatchLists({
        num: this.params.pageSize,
        page: this.params.pageNum,
        dispatchId: this.$props.streamMediaAssociatedRow.id,
        name: this.leftSearchName
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.leftTableData = res.data.data.list
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.pageSize
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async rightInit() {
      await getAllNorthDispatchLists({
        num: this.params.pageSize,
        page: this.params.pageNum,
        dispatchId: this.$props.streamMediaAssociatedRow.id,
        name: this.rightSearchName
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.rightTableData = res.data.data.list
            this.params1.total = res.data.data.total
            this.params1.pages = res.data.data.pages
            this.params1.current = res.data.data.pageSize
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
    goback() {
      this.$emit('init')
      this.$emit('changeIsShow', false)
    },
    //数组去重
    fn2(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, arr.id))
    },
    handleSelectionChange(data) {
      if (this.$refs.tableLeft.selection.length === 0) {
        this.isRightClicked = false
        this.tableLeftSelectionLength = 0
      } else {
        this.isRightClicked = true
        this.tableLeftSelectionLength = data.length
      }
    },
    handleSelectionChange1(data) {
      if (this.$refs.tableRight.selection.length === 0) {
        this.isLeftClicked = false
        this.tableRightSelectionLength = 0
      } else {
        this.isLeftClicked = true
        this.tableRightSelectionLength = data.length
      }
    },
    selectRows(val) {
      if (val === 'left') {
        if (this.$refs.tableLeft.selection.length === 0) {
          this.isRightClicked = false
          this.tableLeftSelectionLength = 0
        } else {
          this.isRightClicked = true
          this.tableLeftSelectionLength = this.$refs.tableLeft.selection.length
        }
      } else {
        if (this.$refs.tableRight.selection.length === 0) {
          this.isLeftClicked = false
          this.tableRightSelectionLength = 0
        } else {
          this.isLeftClicked = true
          this.tableRightSelectionLength =
            this.$refs.tableRight.selection.length
        }
      }
    },
    //左到右
    Right() {
      if (this.$refs.tableLeft.selection.length === 0) {
        // this.$notify({
        //   title: '提示',
        //   message: '',
        //   type: 'warning',
        //   duration: 2000
        // })
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

        let gatewayIds = []
        selectLeftList.map((item) => {
          gatewayIds.push(item.id)
        })
        bindingNorthLists({
          gatewayIds,
          dispatchId: this.$props.streamMediaAssociatedRow.id
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '关联网关成功'
            })
            this.params1.pageNum = 1
            this.params.pageNum = 1
            this.rightInit()
            this.leftInit()
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
        this.tableRightSelectionLength = this.$refs.tableLeft.selection.length
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

        let gatewayIds1 = []
        selectRightList.map((item) => {
          gatewayIds1.push(item.id)
        })

        unbindingNorthLists({
          gatewayIds: gatewayIds1,
          dispatchId: this.$props.streamMediaAssociatedRow.id
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '解除网关成功'
            })
            this.params1.pageNum = 1
            this.params.pageNum = 1
            this.rightInit()
            this.leftInit()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table::before {
  height: 0 !important;
}
::v-deep .el-dialog {
  margin-top: 4vh !important;
}
::v-deep .el-dialog__body {
  padding: 20px;
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

.transferbox {
  height: calc(100% - 16px);
  width: 50%;
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
      float: right;
    }
  }
  .contont {
    height: calc(100% - 110px);
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
.streamMediaAssociated-content {
  // height: 90%;
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

  .streamMediaAssociated-transfer {
    height: calc(100% - 100px);
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .securityArea_container {
      float: left;
      max-height: 730px;
      overflow-y: auto;
      overflow-x: hidden;
      width: 340px;
      margin: 16px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    }
    .left-contnet {
      width: calc(100% - 0px);
      height: 100%;
      padding: 0 20px;
      float: right;
    }
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
.left-table {
  max-height: calc(100% - 120px);
  overflow-y: auto;
}
.right-table {
  max-height: calc(100% - 120px);
  overflow-y: auto;
}
</style>
