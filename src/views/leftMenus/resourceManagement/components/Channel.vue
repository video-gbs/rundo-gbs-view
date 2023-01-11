<template>
  <div class="channel-content">
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
          <el-button type="primary"
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
          <el-button
            ><svg-icon class="svg-btn" icon-class="del" />批量删除</el-button
          >

          <el-button
            ><svg-icon class="svg-btn" icon-class="move" />移动</el-button
          >
          <el-button type="primary" @click="addEquipments"
            ><svg-icon class="svg-btn" icon-class="add" />新增</el-button
          >
        </div>
      </div>
      <el-table
        ref="channel"
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
          label="设备名称1"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="coding"
          label="设备编码1"
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
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
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
    synchronizationData() {},
    editData() {},
    restart() {},
    deploymentData() {},
    deleteData() {},
    addEquipments() {
      console.log(123)
      // this.$router.push({ path: '/addEquipment' })
    }
  }
}
</script>

<style lang="scss" scoped>
.channel-content {
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
}
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
</style>
