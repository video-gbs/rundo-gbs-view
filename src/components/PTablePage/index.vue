<template>
  <div class="p-table-page">
    <span v-if="isLayoutKey('total')" class="table-page-total">
      共{{ page.total }}项
    </span>
    ，
    <span v-if="isLayoutKey('sizes')" class="table-page-sizes">
      每页显示
      <el-select v-model="page.pageSize" size="mini" @change="handleSizeChange">
        <el-option
          v-for="val in defaultPage.pageSizes"
          :key="val"
          :label="val"
          :value="val" />
      </el-select>
      个项目</span>
    <el-pagination
      background
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      layout="prev, pager, next"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
    <span v-if="isLayoutKey('jumper')" class="table-page-jumper">
      跳至
      <el-input-number
        v-model="page.pageNum"
        class="table-page__editor"
        size="mini"
        :min="1"
        :max="maxNum"
        :controls="false"
        @keyup.enter.native="handlePageChange(page.pageNum)" />
      页
    </span>
  </div>
</template>

<script>
export default {
  name: 'PTablePage',
  model: {
    prop: 'page',
    event: 'change'
  },
  props: {
    page: {
      type: Object,
      default: () => {
        return {}
      }
    },
    autoQuery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultPage: {
        total: 0, // 总页数
        pagerCount: 7, // 超过多少条隐藏
        pageNum: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true // 背景颜色
      }
    }
  },
  computed: {
    maxNum() {
      return Math.ceil(this.page.total / this.page.pageSize)
    }
  },
  created() {
  },
  methods: {
    isLayoutKey(key) {
      return this.defaultPage.layout.indexOf(key) !== -1
    },
    handleSizeChange(val) {
      // 自动查询下一页
      if (this.autoQuery) {
        if (this.$parent.$refs.query) {
          this.$parent.$refs.query.query()
        } else {
          this.$parent.query()
        }
      } else {
        this.page.pageNum = 1
        this.$emit('handleSizeChange', val)
      }
    },
    handlePageChange(val) {
      console.log(val, this.autoQuery, this.$parent.$refs.query)
      // 自动查询下一页
      if (this.autoQuery) {
        if (this.$parent.$refs.query) {
          this.$parent.$refs.query.query()
        } else {
          this.$parent.query()
        }
      } else {
        this.$emit('handlePageChange', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .p-table-page {
        // position: relative;
        // bottom: 0;
        padding: 20px 20px 20px 20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-pagination {
            margin-top: 0;
        }
        .table-page-total {
            font-size: 14px;
            white-space: nowrap;
        }
        .table-page-sizes {
            font-size: 14px;
            white-space: nowrap;
            ::v-deep .el-select .el-input {
                width: 70px;
            }
        }

        .table-page-jumper {
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
            color: #999;
            // margin-top: 10px;
            .table-page__editor {
                width: 40px;
                margin: 0 10px;
                // ::v-deep .el-input .el-input__inner {
                //     height: 28px;
                // }
            }
        }
    }
</style>
