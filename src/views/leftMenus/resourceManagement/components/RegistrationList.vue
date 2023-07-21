<template>
  <div class="registrationList-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back-svg" @click="goback" /><span
          class="back-title"
          >待注册列表</span
        >
      </div>
    </div>
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="设备名称:">
          <el-input
            v-model="searchParams.deviceName"
            placeholder="请输入名称"
            clearable
            class="mr10"
          ></el-input>
        </el-form-item>

        <el-form-item label="ip地址:">
          <el-input
            v-model="searchParams.ip"
            placeholder="请输入IP地址"
            clearable
            class="mr10"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="float: right; margin-right: 20px"
          class="form-btn-list"
        >
          <el-button @click="resetData($event)"
            ><svg-icon class="svg-btn" icon-class="cz" />
            <span class="btn-span">重置</span></el-button
          >
          <el-button type="primary" @click="cxData"
            ><svg-icon class="svg-btn" icon-class="cx" />
            <span class="btn-span">搜索</span></el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <el-table
        ref="registrationListTable"
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
        <!-- <el-table-column type="selection" width="80" align="center">
        </el-table-column> -->
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="deviceName"
          label="设备名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="originId"
          label="设备编码"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="deviceId"
          label="设备序列号（平台）"
          :show-overflow-tooltip="true"
          width="160"
        />
        <el-table-column prop="deviceType" label="设备类型" />
        <el-table-column
          prop="ip"
          label="IP地址"
          :show-overflow-tooltip="true"
          width="120"
        />

        <el-table-column prop="port" label="端口" width="80" />
        <el-table-column prop="gatewayName" label="网关" />
        <el-table-column prop="status" label="在线" width="80">
          <template slot-scope="scope">
            <span
              :class="scope.row.onlineState === 1 ? 'yuan' : 'yuan1'"
            ></span>
            <span
              v-if="scope.row.onlineState === 1"
              style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
              >在线</span
            >
            <span
              v-else
              style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
              >离线</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="signState" label="注册状态" width="120">
          <template slot-scope="scope">
            <!-- <span
              :class="scope.row.onlineState === 1 ? 'yuan' : 'yuan1'"
            ></span> -->
            <span
              v-if="scope.row.signState === 0"
              style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
              >已注册</span
            >
            <span
              v-else-if="scope.row.signState === 1"
              style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
              >待添加</span
            >
            <span
              v-else-if="scope.row.signState === 2"
              style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
              >待注册</span
            >
            <span
              v-else
              style="margin-left: 10px; color: rgba(177, 177, 177, 1)"
              >已删除</span
            >
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goAddRouter(scope.row)"
              v-if="scope.row.signState === 1"
              >添加
            </el-button>

            <!-- @click="register(scope.row)" -->
            <el-button type="text" v-if="scope.row.signState === 2"
              >注册
            </el-button>

            <!-- @click="editData(scope.row)" -->
            <el-button
              type="text"
              @click="goAddRouter(scope.row)"
              v-if="scope.row.signState === -1"
              >恢复
            </el-button>
            <el-button
              type="text"
              @click="deleteDevice(scope.row)"
              :disabled="scope.row.signState !== 2"
              ><span :class="[scope.row.signState === 2 ? 'delete-button' : '']"
                >删除</span
              ></el-button
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
</template>

<script>
import { getDeviceList, deleteDevice } from '@/api/method/encoder'
import pagination from '@/components/Pagination/index.vue'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
      tableData: [],
      searchParams: {
        deviceName: '',
        ip: null
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        model: '',
        username: '',
        deviceType: '',
        manufacturer: '',
        videoAreaId: '',
        name: '',
        password: ''
      },
      form1: {
        transport: '',
        longitude: '',
        longitude: '',
        port: '',
        ip: ''
      },
      List: '',
      Ids: [],
      Id: '',
      defaultProps: {
        children: 'children',
        label: 'areaName'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.init()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.init()
    },
    async init() {
      await getDeviceList({
        num: this.params.pageSize,
        page: this.params.pageNum,
        ...this.searchParams
      }).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.params.total = res.data.data.total
          this.params.pages = res.data.data.pages
          this.params.current = res.data.data.pageSize
        }
      })
    },
    // 点击节点选中
    nodeClickHandle(data) {
      this.form.videoAreaId = data.areaName
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    save() {
      // console.log(1111,this.$refs.userTable.selection)
      Promise.all([
        this.$refs.form.validate(),
        this.$refs.form1.validate()
      ]).then(() => {
        this.form.videoAreaId = this.Id
        this.form.deviceType = Number(this.form.deviceType)
        this.form.gatewayId = 7
        addEncoder({ ...this.form, ...this.form1, deviceId: 1 }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新建成功'
            })
            this.goback()
          }
        })
      })
    },
    goback() {
      this.$emit('changeIsShow', 'registrationList', false)
    },

    goAddRouter(row) {
      this.$emit('changeIsShow', 'registrationList', false)
      this.$emit('changeIsShow', 'editEquipment', true, row, '2')
    },

    resetData(e) {
      this.searchParams = {
        deviceName: '',
        ip: ''
      }
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
      this.params.pageNum = 1
      this.init()
    },
    cxData() {
      this.init()
    },
    deleteDevice(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDevice(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.init()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .table-content-bottom .el-table__fixed-right {
  height: 100% !important;
}
::v-deep .el-table--enable-row-transition {
  height: 100% !important;
}
// 滚动条大小设置
::v-deep .table-content-bottom::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}
::v-deep .el-card__header {
  padding: 0 16px;
  height: 62px;
}
::v-deep .el-card__body {
  padding-bottom: 0;
}
.registrationList-content {
  height: 100%;
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
  .search {
    width: calc(100% - 40px);
    height: 80px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      position: relative;
      top: 60%;
      transform: translate(0%, -50%);
    }
  }
  .table-content {
    background: #ffffff;
    max-height: 900px;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 18px;
    margin: 20px;
    .table-content-top {
      .table-content-top-check {
        float: left;
        margin-bottom: 30px;
      }
      .btn-lists {
        float: right;
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
    .table-content-bottom {
      // padding: 0 18px;
      max-height: 790px;
      overflow-y: auto !important;
    }
    .yuan {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #359000;
    }
    .yuan1 {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #b1b1b1;
    }
    .delete-button {
      color: red !important;
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
}
.form-btn-list {
  .btn-span {
    position: relative;
    top: -1px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
  }
  .svg-btn {
    position: relative;
    top: -1px;
    left: -6px;
  }
}
</style>
