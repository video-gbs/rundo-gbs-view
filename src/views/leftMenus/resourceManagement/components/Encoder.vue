<template>
  <div class="encoder-content">
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="设备类型:">
          <el-select
            v-model="searchParams.deptType"
            class="mr10"
            placeholder="请选择"
          >
            <el-option
              v-for="obj in optionsList"
              :key="obj.value"
              :label="obj.label"
              :value="obj.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="searchParams.status"
            class="mr10"
            placeholder="请选择"
          >
            <el-option
              v-for="obj in optionsList"
              :key="obj.value"
              :label="obj.label"
              :value="obj.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left: 60px">
          <el-input
            v-model="searchParams.name"
            placeholder="请输入设备名称/设备编码/IP地址"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item style="float: right; margin-right: 20px">
          <el-button
            ><svg-icon class="svg-btn" icon-class="cz" />重置</el-button
          >
          <el-button type="primary" @click="cxData"
            ><svg-icon class="svg-btn" icon-class="cx" />查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="table-content">
      <div class="table-content-top">
        <el-checkbox v-model="checked" class="table-content-top-check"
          >包含下级组织</el-checkbox
        >
        <div class="btn-lists">
          <el-button @click="deleteAccount(1)"
            ><svg-icon class="svg-btn" icon-class="del" />批量删除</el-button
          >

          <el-button @click="moveEquipment"
            ><svg-icon class="svg-btn" icon-class="move" />移动</el-button
          >
          <el-button type="primary" @click="addEquipment"
            ><svg-icon class="svg-btn" icon-class="add" />新增</el-button
          >
        </div>
      </div>
      <el-table
        ref="encoder"
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
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="coding"
          label="设备编码"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="type" label="设备类型" width="80" />
        <el-table-column
          prop="ip"
          label="IP地址"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="port" label="端口" width="80" />
        <el-table-column prop="manufacturer" label="设备厂家" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span :class="scope.row.status === 1 ? 'yuan' : 'yuan1'"></span>
            <span
              v-if="scope.row.status === 1"
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
        <el-table-column width="240" label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editData(scope.row.id)"
              >编辑
            </el-button>
            <el-button type="text" @click="restart(scope.row.id)"
              >重启
            </el-button>
            <el-button type="text" @click="synchronizationData(scope.row.id)"
              >同步
            </el-button>
            <el-button type="text" @click="deploymentData(scope.row.id)"
              >布防
            </el-button>
            <el-button type="text" @click="deleteData(scope.row)"
              ><span class="delete-button">删除</span></el-button
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

    <el-dialog title="移动位置" :visible.sync="dialogShow" width="30%">
      <div slot="title" class="dialog-title">
        <LineFont
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <el-form label-width="100px" :model="dialogForm">
        <el-form-item label="设备数量：">
          {{ dialogForm.num }}
        </el-form-item>
        <el-form-item label="设备名称：">
          <span class="dialogEquipmentName">{{
            dialogForm.dialogEquipmentName
          }}</span>
        </el-form-item>
      </el-form>
      <div class="securityArea_container">
        <leftTree />
      </div>

      <div class="dialog-footer">
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary"
          ><svg-icon class="svg-btn" icon-class="save" />确认</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="选择编码器" :visible.sync="dialogShow1" width="80%">
      <div slot="title" class="dialog-title">
        <LineFont
          :line-title="lineTitle1"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <el-form label-width="80px" :model="dialogForm1">
        <el-row>
          <el-col :span="8">
            <el-form-item label="当前目录">
              <el-select
                v-model="dialogForm1.region"
                placeholder="请选择活动区域"
              >
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="float: right">
            <el-form-item>
              <el-input
                placeholder="请输入搜索关键字"
                suffix-icon="el-icon-search"
                class="search-input"
                v-model="dialogForm1.inputValue"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        ref="dialogEncoder"
        class="table-content-bottom"
        :data="dialogTableData"
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
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="coding"
          label="设备编码"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="ip"
          label="IP地址"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="manufacturer" label="设备厂家" width="80" />
        <el-table-column prop="city" label="所属行政区域" width="240" />
      </el-table>

      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />

      <div class="dialog-footer">
        <el-button @click="dialogShow1 = false">取消</el-button>
        <el-button type="primary"
          ><svg-icon class="svg-btn" icon-class="save" />确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import LineFont from '@/components/LineFont'
export default {
  name: '',
  components: { pagination, leftTree, LineFont },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      lineTitle: {
        title: '移动位置',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '选择编码器',
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
      dialogForm: {
        num: 3,
        dialogEquipmentName:
          '海康NVR ; 海康IPC ; 34020000001320000028 ; 海康NVR ; 海康IPC ; 34020000001320000028 ; 海康NVR ; 海康IPC ; 34020000001320000028 ;'
      },
      dialogForm1: {
        inputValue: ''
      },
      searchParams: {
        deptType: '',
        name: '',
        status: 1
      },
      query: {},
      optionsList: [
        {
          label: 'ces',
          value: 'ces'
        }
      ],
      checked: false,
      dialogShow: false,
      dialogShow1: false,
      dialogTableData: [
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 2
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          city: '广东省/广州市/珠海区/新竹街道…',
          manufacturer: '海康',
          status: 2
        }
      ],
      tableData: [
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 1
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 2
        },
        {
          name: '球机192.168……',
          coding: '4400000000111500…',
          type: 'IPC',
          ip: '192.168.119.152',
          port: 8000,
          manufacturer: '海康',
          status: 2
        }
      ]
    }
  },
  mounted() {},
  methods: {
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
    },
    currentChange(proCount) {
      this.params.proCount = proCount
    },
    synchronizationData() {
      this.$router.push(`/activeDiscovery/transfer`)
    },
    editData() {},
    restart() {},
    deploymentData() {
      this.dialogShow1 = true
    },
    deleteData() {},
    cxData() {},
    addEquipment() {
      this.$router.push(`/addEquipment/add`)
    },
    moveEquipment() {
      this.dialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}

.encoder-content {
  .search {
    width: 100%;
    height: 80px;
    // line-height: 80px;
    margin-bottom: 20px;
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
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 18px;
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
    }
  }
  .delete-button {
    color: red !important;
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

  .securityArea_container {
    height: calc(100% - 40px);
    width: 310px;
    margin: 10px;
    // background: #ffffff;
    // box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
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
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
</style>
