<template>
  <div class="ComTabble">
    <!-- <div class="btn-content flex-lr">
      <div class="left-title">{{ leftTitle }}</div>
    </div> -->
    <el-table
      ref="comTable"
      v-loading="isLoading"
      :data="tableData"
      v-bind="$attrs"
      :show-summary="showSummary"
      :header-cell-style="headerStyle"
      highlight-current-row
      border
      :style="{ height: heightTable, width: '100%' }"
      :height="MaxHeight"
      :cell-style="changeCellStyle"
      v-on="$listeners"
    >
      <!-- 多选框 -->
      <!-- <el-table-column
        v-if="selection"
        type="selection"
        width="60"
        align="center"
        fixed="left"
      >
      </el-table-column> -->
      <!-- 序号 -->
      <!-- <el-table-column
        v-if="index"
        type="index"
        label="序号"
        width="80"
        fixed="left"
        align="center"
        :index="table_index"
      >
      </el-table-column> -->
      <!-- 内容项 -->
      <el-table-column
        v-for="(item, index) in tableItems"
        :key="item.name + index"
        :prop="item.name"
        :label="item.label"
        :width="item.width"
        min-width="120"
        :style="{
          'text-align': item.align ? 'center !important;' : 'left !important;'
        }"
        :class-name="item.isBold ? 'project-name-bold' : ''"
        show-overflow-tooltip
      >
        <template slot-scope="scope">

          <el-switch
            v-if="item.content === 'isShow'"
            v-model="scope.row.isShow"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#eeeeee"
          />
          <el-switch
            v-else-if="item.content === 'isReview'"
            v-model="scope.row.isReview"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#eeeeee"
            disabled
          />
          <span v-else-if="item.content==='type'" class="column-span">{{ $dict.type[scope.row[item.name]] }}</span>
          <span v-else-if="item.content==='status'" class="column-span">{{ $dict.status[scope.row[item.name]] }}</span>
          <span v-else class="column-span">{{ scope.row[item.name] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="buttonItems"
        :label="buttonItems.label"
        align="center"
        fixed="right"
        :width="buttonItems.width"
      >
        <template slot-scope="scope">
          <slot name="buttonItem" :row="scope.row">
            <div class="table-button">
              <el-button
                v-for="item in buttonItems.options"
                :key="item.text || item.icon"
                :type="item.type || 'text'"
                :class="item.className"
                @click="handleClick(item.cb, scope.row)"
              >
                <i :class="item.icon" />
                {{ distinguishCode(scope.row, item) }}
              </el-button>
            </div>
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ComTabble',
  props: {
    // 是否显示合计行
    showSummary: {
      type: Boolean,
      default: () => false
    },
    // 项目列表fitstColumn
    leftTitle: {
      type: String,
      default: () => ''
    },
    // 固定行
    isFixed: {
      type: Boolean,
      default: () => true
    },
    isLoading: {
      type: Boolean,
      default: () => true
    },
    total: {
      type: Number,
      default: () => 0
    },
    // 表格整体高度
    heightTable: {
      type: String,
      default: () => '100%'
    },
    // 表格内容高度
    MaxHeight: {
      type: String,
      default: () => 'auto'
      // default: () => '650'
    },
    // 是否多选
    selection: {
      type: Boolean,
      default: () => false
    },
    // 是否展示序号
    index: {
      type: Boolean,
      default: () => false
    },
    // 当前页
    pageNum: {
      type: Number,
      default: () => 0
    },
    // 每页有多少条
    pageSize: {
      type: Number,
      default: () => 0
    },
    // 是否控制头部显示
    isCheckedHeader: {
      type: Boolean,
      default: () => false
    },
    // 头部导航
    headerBtn: {
      type: Array,
      default: () => []
    },
    // 列表配置项 [{name,label,sortable?,style?,width? }]
    tableItems: {
      type: Array,
      default: () => [
        {
          isShow: true
        }
      ]
    },
    // 操作按钮
    buttonItems: {
      type: Object
    },
    // 头部样式
    headerStyle: {
      type: Object
    },
    // 列表内容
    tableData: {
      type: Array,
      default: () => []
    },
    // 显示的头部
    checkedHeader: {
      type: Array,
      default: () => []
    },
    distinguishCode: {
      type: Function,
      default: (tableData, itemData) => {
        return itemData.text
      }
    }
  },
  data() {
    return {
      // 显示的头部
      checkedHeaderData: [],
      isClicked: false,
      value: true,
      value1: false
    }
  },
  watch: {
    '$props.checkedHeader': {
      handler: function(params) {
        this.$nextTick(() => {
          this.checkedHeaderData = params
        })
      },
      deep: true
    }
  },
  mounted() {
    // this.getCheckItem();
    console.log('tableItems', this.tableItems)
  },
  methods: {
    // 获取当前
    table_index(index) {
      return (this.pageNum - 1) * this.pageSize + index + 1
    },
    getCheckItem() {
      const list = []
      this.tableItems.map(item => {
        if (item.isShow) {
          list.push(item.label)
        }
        return item
      })
      this.$nextTick(() => {
        this.checkedHeader = list
      })
    },
    // 更改头部显示
    changeTableHeader(val) {
      this.$emit('changeTableHeader', val)
    },
    // 头部按钮
    haederBtnClick(val) {
      this.$emit('haederBtnClick', val)
    },
    // 操作按钮回调
    handleClick(cb, row) {
      this.$emit('handleClick', { cb: cb, row: row })
    },
    handleSizeChange(val) {
      this.$emit('size-changes', val)
    },
    // 页码选中
    paginationCurrentChange(val) {
      this.$emit('current-changes', val)
    },
    // 列表选中改变
    tableCurrentChanges(val) {
      this.$emit('tableCurrentChanges', val)
    },
    // 排序操作
    sortChange({ prop, order }) {
      this.$emit('sortChange', prop, order)
    },
    changeCellStyle(row, column, rowIndex, columnIndex) {
      if (
        row.column.label === '项目名称' &&
        row.row.projectSubName &&
        row.row.projectSubName.length !== 0
      ) {
        return 'font-weight: 900' // 修改的样式
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.com-pagination {
  margin-top: 20px;
  text-align: right;
}
.btn-content {
  height: 80px;
  line-height: 80px;
  padding: 0;
}
.project-name-bold ::v-deep .el-tooltip {
  font-weight: 800 !important;
  color: red !important;
}
.isWarning,
.isGreen,
.isRed {
  display: inline-block;
  vertical-align: middle;
}
.isWarning {
  display: inline-block;
  vertical-align: middle;
}
.isGreen {
  background: green;
  height: 16px;
  width: 16px;
  border-radius: 50%;
}
.isRed {
  color: red;
}
.selection-item {
  text-align: center !important;
}
.column-span {
  font-size: 14px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #333333;
}
</style>
