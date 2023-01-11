<template>
  <div class="activeDiscovery-content">
    <div class="panel-header-box">
      <div>
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >主动发现</span
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
              <el-checkbox v-model="checked" class="table-content-top-check"
                >已勾选 1/{{ tableData.length }}</el-checkbox
              >
              <el-input
                placeholder="请输入搜索关键字"
                suffix-icon="el-icon-search"
                class="search-input"
              ></el-input>
            </div>
            <div class="contont">
              <el-table
                ref="dialogEncoder"
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
                  prop="manufacturer"
                  label="所属设备"
                  width="240"
                />
              </el-table>

              <pagination
                :pages-data="params"
                @size-change="sizeChange"
                @current-change="currentChange"
              />
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                v-if="showCheck"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="(item, index) in list"
                  :label="item.id"
                  :key="index"
                  >{{ item.channelName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <!-- 中间按钮 -->
          <div class="vertical center3 centrebtn">
            <svg-icon
              icon-class="right"
              class="right_svg"
              @click="singleSel()"
            />
            <svg-icon icon-class="left" class="left_svg" @click="mutiSel()" />
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
              <el-checkbox v-model="checked" class="table-content-top-check"
                >已勾选 1/{{ tableData.length }}</el-checkbox
              >
              <el-input
                placeholder="请输入搜索关键字"
                suffix-icon="el-icon-search"
                class="search-input"
              ></el-input>
            </div>

            <div style="padding: 10px" class="contont">
              <el-table
                ref="dialogEncoder"
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
                  prop="manufacturer"
                  label="所属设备"
                  width="240"
                />
              </el-table>

              <pagination
                :pages-data="params"
                @size-change="sizeChange"
                @current-change="currentChange"
              />
              <!-- <el-checkbox
                :indeterminate="isIndeterminateThen"
                v-model="checkAllThen"
                @change="handleCheckAllChangeThen"
                >全选</el-checkbox
              > -->
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="checkedCitiesThen"
                @change="handleCheckedCitiesChangeThen"
              >
                <el-checkbox
                  v-for="(item, index) in selectedData"
                  :label="item.id"
                  :key="index"
                  >{{ item.channelName }}</el-checkbox
                >
              </el-checkbox-group>
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
      },
      checkAllThen: false,
      checkedCitiesThen: [],
      isIndeterminateThen: true,
      checkAllDeatilListThen: [],
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      checkAllDeatilList: [],
      parentId: null,
      listLoading: false,
      list: [],
      listQuery: Object.assign({}, defaultListQuery),
      filter: '',
      orgData: [],
      checkedArr: [],
      showCheck: false,
      showTree: true,
      selectedData: [],
      checkedIDArray: []
    }
  },
  mounted() {},
  methods: {
    goback() {
      this.$router.push({ path: '/equipment' })
    },
    //数组去重
    fn2(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, arr.id))
    },
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          props: { disabled: disabled || item.disabled }
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
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
  height: 600px;
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
