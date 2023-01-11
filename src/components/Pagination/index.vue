<template>
  <div class="EcologyPagination-has">
    <span class="EcologyPagination-span" v-show="false"
      >项目个数共计[{{
        pagesData.proCount ? pagesData.proCount : 0
      }}]个,项目个数(含子项目)共计[{{ pagesData.total }}]个。</span
    >
    <el-pagination
      class="pagination-div"
      background
      border
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagesData.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagesData.pageSize"
      :total="pagesData.total"
      @size-change="handleSizeChange"
      @current-change="paginationCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'EcologyPagination',
  props: {
    // 分页器内容
    pagesData: {
      type: Object,
      default: () => ({
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0
      })
    }
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    // 页码选中
    paginationCurrentChange(val) {
      this.$emit('current-change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.EcologyPagination {
  margin-top: 20px;
  text-align: right;
  display: flex;
  justify-content: space-between;
  .EcologyPagination-span {
    font-size: 14px;
    letter-spacing: 2px;
  }
}
.EcologyPagination-has {
  margin-top: 20px;
  text-align: right;
  .EcologyPagination-span {
    font-size: 14px;
    letter-spacing: 2px;
  }
}
</style>
