<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box">
      <div class="title-css">公告管理</div>
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
              <el-button size="mini" type="primary" @click="goPage('/publicManagement/add')">新增</el-button>
            </div>
          </template>
          <el-table-column
            prop="title"
            label="标题"
          />
          <el-table-column
            prop="orderValue"
            label="显示顺序"
            width="80"
          />
          <el-table-column
            prop="isShow"
            label="显示状态"
            width="80"
          >
            <template slot-scope="scope">
              {{ dict.isShow[scope.row.isShow] }}
            </template>
          </el-table-column>
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
            <el-button type="text" @click="goPage(`/publicManagement/${scope.row.id}`)">编辑</el-button>
            <el-button type="text">删除</el-button>

          </template>
          </el-table-column>
        </el-table-column>

      </el-table>
      <el-pagination
        class="pagination-div"
        background
        border
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="params.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.size"
        :total="params.total"
        @size-change="handleSizeChange"
        @current-change="paginationCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import _dict from '@/dict/index'
import { getAfficheList } from '@/api/method/affiche'
export default {
  name: '',

  data() {
    return {
      params: {
        'current': 1,
        'size': 10,
        'total': 0
      },
      dict: _dict,
      tableData: [
      ]
    }
  },
  mounted() {
    this.getListFn()
  },
  methods: {
    getListFn() {
      getAfficheList(this.params).then(res => {
        if (res.code === 10000) {
          this.tableData = res.data.records
          this.params.total = res.data.total
        }
      })
    },
    handleSizeChange(v) {
      console.log('v')
      // 执行搜索
    },
    paginationCurrentChange(v) {
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
