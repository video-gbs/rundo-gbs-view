<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box">
      <div class="title-css">公告管理</div>
    </div>
    <div class="p10">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column>
          <template slot="header">
            <div class="f ai-c jc-sb">
              <div>数据列表</div>
              <el-button size="mini" type="primary" @click="goPage('/publicManagement/add')">新增</el-button>
            </div>
          </template>
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="orderValue" label="显示顺序" width="80" />
          <el-table-column prop="isShow" label="显示状态" width="80">
            <template slot-scope="scope">
              {{ dict.isShow[scope.row.isShow] }}
            </template>
          </el-table-column>
          <el-table-column prop="isShow" label="是否显示" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isShow"
                active-color="#4caf50"
                inactive-color="#eeeeee"
                :active-value="0"
                :inactive-value="1"
                @change="editShowFn(scope.row,editShow)"
              />
              <!-- {{ dict.isShow[scope.row.isShow] }} -->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column width="200" label="操作"> <template slot-scope="scope">
            <el-button type="text" @click="orderDialogFn(scope.row)">显示顺序</el-button>
            <!-- <el-button type="text">设为可见</el-button> -->
            <el-button type="text" @click="goPage(`/publicManagement/${scope.row.id}`)">编辑</el-button>
            <el-button type="text" @click="deleteFn(scope.row, remove, getListFn)">删除</el-button>
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
    <PDialog ref="orderDialog" @submit="editOrder">
      <template slot="main">
        <el-form label-width="80px" :model="orderForm">
          <el-form-item label="标题">
            {{ one.title }}
          </el-form-item>
          <el-form-item label="显示顺序">
            <el-input-number v-model="one.orderValue" :min="0" :max="1000" label="描述文字" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
  </div>
</template>

<script>
import _dict from '@/dict/index'
import _mixins from '@/mixins/index'
import { getAfficheList, deleteAffiche, editAffiche, editAfficheOrder, editAfficheIsShow } from '@/api/method/affiche'
export default {
  name: '',
  mixins: [_mixins],
  data() {
    return {
      params: {
        'current': 1,
        'size': 10,
        'total': 0
      },
      dict: _dict,
      tableData: [
      ],
      one: {},
      orderForm: { order: 0 },
      remove: deleteAffiche,
      editShow: editAfficheIsShow
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
      this.params.size = v
      this.getListFn()
    },
    paginationCurrentChange(v) {
      console.log('v2')
      // 执行搜索
      this.params.current = v
      this.getListFn()
    },
    goPage(path, query) {
      this.$router.push(path)
    },
    // deleteFn(v) {
    //   this.$alert(`确定要删除公告 '${v.title}' 吗?`, '删除公告', {
    //     dangerouslyUseHTMLString: true,
    //     showCancelButton: true
    //   }).then(action => {
    //     deleteAffiche(v.id).then(res => {
    //       res.code === 1000 && (this.$message.success('删除成功'), this.getListFn())
    //     })
    //   })
    // },
    editOrder() {
      editAfficheOrder(this.one.id, this.one.orderValue).then(res => {
        res.code === 10000 && (this.$message.success('修改成功'), this.$refs['orderDialog'].visible = false)
      }).catch(() => {

      })
    },

    orderDialogFn(v) {
      this.one = v
      this.$refs['orderDialog'].visible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
