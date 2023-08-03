<template>
  <div class="channelDiscovery-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >添加通道</span
        >
      </div>
    </div>
    <div class="channelDiscovery-transfer">
      <div class="securityArea_container">
        <leftTree
          :treeData="treeList"
          @childClickHandle="childClickHandle"
          :defaultPropsName="areaNames"
        />
      </div>
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
              <el-input
                placeholder="请输入通道名称"
                class="search-input"
                clearable
                v-model="leftSearchName"
                ><el-button
                  icon="el-icon-search"
                  slot="append"
                  @click="search()"
                ></el-button
              ></el-input>
            </div>
            <div class="contont">
              <el-table
                ref="tableLeft"
                class="table-content-bottom"
                :data="tableData"
                row-key="id"
                @selection-change="handleSelectChange"
                @select="handleSelect"
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
                <el-table-column prop="signState" label="状态" width="140">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.signState === 1 ? '待添加' : '删除'
                    }}</span>
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
import LineFont from '@/components/LineFont'
import pagination from '@/components/Pagination/index.vue'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'

import {
  getFindChannelById,
  addChannel,
  channelVideoAreaList
} from '@/api/method/channel'

import { getVideoAraeTree } from '@/api/method/role'

export default {
  name: '',
  components: { LineFont, pagination, leftTree },
  props: ['treeList'],
  data() {
    return {
      form: {},
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      selectedObj: {},
      selectedData: [],
      leftSearchName: '',
      areaNames: 'resourceName',
      selectedList: [],
      // treeList: [],
      channelId: '',
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
    // this.init()
    // this.getVideoAraeTree()
  },
  methods: {
    // async getVideoAraeTree() {
    //   await channelVideoAreaList()
    //     .then((res) => {
    //       if (res.data.code === 0) {
    //         this.treeList = [res.data.data]
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },

    handleSelectChange(selection) {
      // 全选取消，删除当前页所有数据
      if (selection.length === 0) {
        this.tableData.forEach((item) => {
          delete this.selectedObj[item.channelId]
        })
      }
      // 勾选数据 添加
      selection.forEach((item) => {
        this.selectedObj[item.channelId] = item
      })
      // 获取所有分页勾选的数据
      this.selectedData = []
      for (const key in this.selectedObj) {
        this.selectedData.push(this.selectedObj[key])
      }
    },

    handleSelect(selection, row) {
      // 取消单个勾选时，删除对应属性
      if (!selection.some((item) => item.channelId === row.channelId)) {
        delete this.selectedObj[row.channelId]
      }
    },

    // 处理当前列表选中状态
    handleRowSelection(data) {
      data.forEach((item) => {
        if (this.selectedObj[item.channelId]) {
          this.$nextTick(() => {
            this.$refs.tableLeft.toggleRowSelection(item)
          })
        }
      })
    },

    search() {
      this.init()
    },

    childClickHandle(data) {
      this.channelId = data.id
    },
    async init() {
      await getFindChannelById({
        page: this.params.pageNum,
        num: this.params.pageSize,
        nameOrOriginId: this.leftSearchName
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.records
            this.handleRowSelection(this.tableData)
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.current
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
      this.$emit('changeIsShow', 'channelDiscovery', false)
    },
    //数组去重
    fn2(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, arr.id))
    },
    save() {
      if (this.$refs.tableLeft.selection.length === 0) {
        this.$message({
          message: '请选择通道',
          type: 'warning'
        })
        return
      } else {
        if (this.channelId === '' && this.channelId.length === 0) {
          this.$message({
            message: '请选择节点',
            type: 'warning'
          })
          return
        }
        // 复制数组对象
        // let selectList = JSON.parse(
        //   JSON.stringify(this.$refs.tableLeft.selection)
        // )

        // selectList.forEach((item) => {
        //   let index = this.tableData.findIndex((_item) => _item.channelId === item.channelId)
        //   if (index !== undefined) {
        //     this.tableData.splice(index, 1)
        //   }
        // })

        let channelList = []
        this.selectedData.map((item) => {
          channelList.push({
            channelCode: item.channelCode,
            channelName: item.channelName,
            deviceExpansionId: item.deviceExpansionId,
            channelId: item.channelId,
            onlineState: item.onlineState
          })
        })
        addChannel({ channelList, videoAreaId: this.channelId }).then((res) => {
          if (res.data.code === 0) {
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
  width: 100%; //右边盒子的宽占比
  border: 1px solid#ebedf2;
  margin-top: 16px;
  margin-right: 16px;
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
.channelDiscovery-content {
  height: 100%;
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
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

  .channelDiscovery-transfer {
    // display: flex;
    // justify-content: space-between;
    height: calc(100% - 106px);
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
      width: calc(100% - 382px);
      // margin-right: 10px;
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
