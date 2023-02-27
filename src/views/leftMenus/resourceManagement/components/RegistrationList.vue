<template>
  <div class="registrationList-content">
    <div class="panel-header-box">
      <div>
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
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
        <el-form-item style="float: right; margin-right: 20px">
          <el-button @click="resetData"
            ><svg-icon class="svg-btn" icon-class="cz" />重置</el-button
          >
          <el-button type="primary" @click="cxData"
            ><svg-icon class="svg-btn" icon-class="cx" />查询</el-button
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
            <el-button
              type="text"
              @click="editData(scope.row)"
              v-if="scope.row.signState === 2"
              >注册
            </el-button>
            <el-button
              type="text"
              @click="editData(scope.row)"
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
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        ip: [{ required: true, message: '请填写ip', trigger: 'blur' }]
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
        console.log('res', res)
        if (res.code === 0) {
          this.tableData = res.data.list
          this.params.total = res.data.total
          this.params.pages = res.data.pages
          this.params.current = res.data.current
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
          if (res.code === 0) {
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
      this.$router.push({ path: '/equipment' })
    },
    goAddRouter(row) {
      this.$router.push({
        path: '/editEquipment',
        query: {
          back: 2,
          row: row
        }
      })
    },
    resetData() {
      this.searchParams = {
        deviceName: '',
        ip: ''
      }
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
          if (res.code === 0) {
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
</style>
