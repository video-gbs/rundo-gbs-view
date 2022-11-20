<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box">
      <div class="title-css">轮播图管理</div>
    </div>
    <div class="p10">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column>
          <template slot="header">

            <div class="f ai-c jc-sb">
              <div>数据列表</div>
              <el-button size="mini" type="primary" @click="goPage('/roundChart/add')">新增</el-button>
            </div>
          </template>
          <el-table-column
            prop="label"
            label="标题"
          />
          <el-table-column
            prop="sort"
            label="显示顺序"
            width="80"
          />
          <el-table-column
            prop="state"
            label="显示状态"
            width="80"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180"
          />
          <el-table-column
            width="280"
            label="操作"
          > <template slot-scope="scope">
            <el-button type="text">显示顺序</el-button>
            <el-button type="text">设为可见</el-button>
            <el-button type="text" @click="goPage(`/roundChart/${scope.row.id}`)">编辑</el-button>
            <el-button type="text">删除</el-button>

          </template>
          </el-table-column>
        </el-table-column>

      </el-table>
      <pagination :pages-data="params" @size-change="sizeChange" @current-change="currentChange" />
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
        total: 0,
        proCount: 0
      },
      tableData: [

        { id: 1, label: 'afsdf', sort: 1, state: 1, createTime: '2022-11-11 15:25:14' }
      ]
    }
  },
  methods: {
    sizeChange(v) {
      console.log('v')
      // 执行搜索
    },
    currentChange(v) {
      console.log('v2')
      // 执行搜索
    },
    goPage(path, query) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
