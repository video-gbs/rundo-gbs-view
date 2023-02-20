<template>
  <div class="activeDiscovery-content">
    <div class="panel-header-box">
      <div>
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >关联</span
        >
      </div>
    </div>
    <div class="activeDiscovery-transfer">
      <div class="right-contnet">
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
                placeholder="请输入搜索关键字"
                suffix-icon="el-icon-search"
                class="search-input"
              ></el-input>
            </div>
            <div class="contont">
              <el-table
                ref="tableLeft"
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
                  prop="channelName"
                  label="通道名称"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="channelCode"
                  label="通道编号"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="deviceExpansionName"
                  label="所属设备"
                  width="240"
                />
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
            <svg-icon icon-class="right" class="right_svg" @click="Right" />
            <svg-icon
              icon-class="left"
              class="left_svg"
              @click="Left"
              :disabled="!selectedStaffData.length"
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
              <el-input
                placeholder="请输入搜索关键字"
                suffix-icon="el-icon-search"
                class="search-input"
              ></el-input>
            </div>

            <div style="padding: 10px" class="contont">
              <el-table
                ref="tableRight"
                class="table-content-bottom"
                :data="selectedStaffList"
                @selection-change="handleSelectedStaffChange"
                border
                :header-cell-style="{
                  background: 'rgba(0, 75, 173, 0.06)',
                  fontSize: '14px',
                  fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
                  fontWeight: 'bold',
                  color: '#333333'
                }"
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
                  prop="channelName"
                  label="通道名称"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="channelCode"
                  label="通道编号"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="deviceExpansionName"
                  label="所属设备"
                  width="240"
                />
              </el-table>

              <pagination
                :pages-data="params"
                @size-change="sizeChange"
                @current-change="currentChange"
              />
            </div>
          </div>
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
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'

import { getFindChannelById, addChannel } from '@/api/method/channel'

import { getVideoAraeTree } from '@/api/method/role'

export default {
  name: '',
  components: { LineFont, pagination, leftTree },
  data() {
    return {
      form: {},
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      areaNames: 'areaNames',
      selectedStaffList: [],
      selectedStaffData: [],
      treeList: [],
      channelId: 1,
      checked: false,
      tableData: [
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
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
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          return !data.hasChildren
        }
      }
    }
  },
  mounted() {
    this.init()
    this.getVideoAraeTree()
  },
  methods: {
    async getVideoAraeTree() {
      await getVideoAraeTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    childClickHandle(data) {
      this.channelId = data.id
    },
    async init() {
      await getFindChannelById({
        page: this.params.pageNum,
        num: this.params.pageSize,
        nameOrOriginId: this.channelId
      })
        .then((res) => {
          if (res.code === 0) {
            this.tableData = res.data.records
            this.params.total = res.data.total
            this.params.pages = res.data.pages
            this.params.current = res.data.current
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.init()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.init()
    },
    goback() {
      this.$router.push({ path: '/equipment' })
    },
    //数组去重
    fn2(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, arr.id))
    },
    //将右边表格选择项存入selectedStaffData中
    handleSelectedStaffChange(rows) {
      this.selectedStaffData = []
      if (rows) {
        rows.forEach((row) => {
          if (row) {
            this.selectedStaffData.push(row)
          }
        })
      }
    },
    //左到右
    Right() {
      if (this.$refs.tableLeft.selection.length === 0) {
        this.$notify({
          title: '提示',
          message: '请选择xxxxx',
          type: 'success',
          duration: 2000
        })
        return
      } else {
        this.selectedStaffList = this.selectedStaffList.concat(
          this.$refs.tableLeft.selection
        )
        // 复制数组对象
        let selectList = JSON.parse(
          JSON.stringify(this.$refs.tableLeft.selection)
        )
        selectList.forEach((item) => {
          let index = this.tableData.findIndex((_item) => _item.id === item.id)
          if (index !== undefined) {
            this.tableData.splice(index, 1)
          }
        })
        this.$refs.tableLeft.clearSelection()

        console.log(this.selectedStaffList, 'this.selectedStaffList')
      }
    },
    //右到左
    Left() {
      setTimeout(() => {
        this.$refs['tableLeft'].clearSelection()
        this.$refs['tableRight'].clearSelection()
      }, 0)
      this.selectedStaffData.forEach((item) => {
        this.tableData.push(item)
      })
      //  console.log(22,this.selectedStaffList );
      //  console.log(33,this.selectedStaffData );
      let arr = this.selectedStaffList.filter((v) =>
        this.selectedStaffData.every((val) => val.id != v.id)
      )
      console.log('--111', arr)
      this.selectedStaffList = arr
    },
    save() {
      let channelList = []
      this.selectedStaffList.map((item) => {
        channelList.push({
          channelCode: item.channelCode,
          channelName: item.channelName,
          deviceExpansionId: item.deviceExpansionId,
          channelId: item.channelId,
          onlineState: item.onlineState
        })
      })
      console.log('channelList', channelList)
      addChannel({ channelList, videoAreaId: this.channelId }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加通道成功'
          })
          this.goback()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
  max-height: 730px;
  overflow-y: auto;
  width: 50%; //右边盒子的宽占比
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
.activeDiscovery-content {
  // height: 90%;
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
    // display: flex;
    // justify-content: space-between;
    height: 90%;
    margin: 20px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .securityArea_container {
      // height: calc(100% - 50px);
      float: left;
      max-height: 730px;
      overflow-y: auto;
      overflow-x: hidden;
      width: 340px;
      margin: 16px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    }
    .right-contnet {
      width: calc(100% - 0px);
      // margin-right: 10px;
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
  bottom: 35px;

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
