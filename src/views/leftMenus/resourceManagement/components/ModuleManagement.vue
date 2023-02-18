<template>
  <div class="main">
    <div class="panel-header-box">
      <div>前端设备</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <leftTree
          :treeData="treeList"
          @childClickHandle="childClickHandle"
          :defaultPropsName="areaNames"
        />
      </div>
      <div class="p10 right-table">
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
              prop="deviceName"
              label="模块名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="areaNames"
              label="序列号"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="deviceId"
              label="通讯域名"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="deviceType" label="协议" width="80" />
            <el-table-column
              prop="ip"
              label="IP"
              :show-overflow-tooltip="true"
            />

            <el-table-column prop="port" label="端口" width="80" />
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
            <el-table-column
              width="180"
              label="操作"
              fixed="right"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="editData(scope.row)"
                  >编辑
                </el-button>
                <el-button type="text" @click="editData(scope.row)"
                  >详情
                </el-button>
                <el-button type="text" @click="deleteDevice(scope.row)"
                  ><span class="delete-button">关联</span></el-button
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
    </div>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
import { getDeviceList, deleteDevice } from '@/api/method/encoder'
export default {
  name: '',
  components: { leftTree },
  data() {
    return {
      treeList: [],
      detailsId: '',
      areaNames: 'areaNames',
      tableData: []
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  computed: {},
  watch: {},
  methods: {
    async init(id) {
      await getDeviceList({
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
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
    childClickHandle(data) {
      this.detailsId = data.id
    }
  }
}
</script>

<style lang="scss" scoped>
/*表格表头全选*/
// ::v-deep .disabledSelection .cell .el-checkbox__inner{
//   margin-left: -30px;
//   position:relative;
// }
// ::v-deep .disabledSelection .cell:before{
//   content:"序号";
//   position:absolute;
//   right:11px;
// }
::v-deep .el-tabs__content {
  flex: 1;
}
::v-deep .el-tabs--border-card {
  box-shadow: none;
  border: 0;
}
.recycle-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 10;
}
::v-deep .el-tabs__item.is-active {
  border: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 20px 24px;
}
::v-deep .el-tabs--border-card {
  background: #f9f9f9;
  border-top: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border: 0 none;
  background: #ececec;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0 none;
  height: 36px;
  margin: 0 4px 4px 0;
  border-radius: 2px;
  background: #f6f6f6 !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  position: relative;
  top: 4px;
}
::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}
::v-deep .el-tabs__item {
  box-shadow: none !important;
}
.main {
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
    border: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .main-content {
    height: calc(100% - 0px);
    display: flex;
    justify-content: space-between;
    .securityArea_container {
      height: calc(100% - 90px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    }
    .right-table {
      width: 100%;
      margin: 6px 0 0 -10px;
      position: relative;
    }
    .right-table-else {
      width: calc(100% - 350px);
      margin: 6px 0 0 -10px;
      position: relative;
    }
  }
}
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
</style>
