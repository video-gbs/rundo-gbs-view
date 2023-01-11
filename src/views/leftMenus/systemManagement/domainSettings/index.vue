<template>
  <div class="router_container2 m20 bg-w f fd-c">
    <div class="panel-header-box">
      <div class="title-css">领域设置</div>
    </div>
    <div class="p10 f1 f fd-c" style="overflow-y: auto">
      <div class="f jc-sb ai-c mv10">
        <div class="fs18 fw600 title-c-1 ti5">领域列表</div>
        <el-button
          size="mini"
          type="primary"
          @click="goPage('/domainSettings/add')"
          >新增</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        :height="setHeigthFn(350)"
        :header-cell-style="{ background: '#eaeaea' }"
        style="width: 100%"
      >
        <el-table-column prop="title" label="领域名" />
        <el-table-column prop="title" label="描述" />
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="orderDialogFn(scope.row)"
              >显示顺序</el-button
            >
            <!-- <el-button type="text">设为可见</el-button> -->
            <el-button
              type="text"
              @click="goPage(`/systemNotice/${scope.row.id}`)"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="deleteFn(scope.row, remove, getListFn)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="f jc-e">
        <el-pagination
          class="pagination-div mt10"
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
    <PDialog ref="dialog" @submit="editOrder">
      <template slot="main">
        <el-form label-width="80px" :model="orderForm">
          <el-form-item label="领域名称">
            <el-input
              v-model="one.title"
              :min="0"
              :max="30"
              type="textarea"
              label="描述文字"
            />
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="one.orderValue"
              :min="0"
              :max="500"
              type="textarea"
              label="描述文字"
            />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
  </div>
</template>

<script>
import _dict from '@/dict/index'
import _mixins from '@/mixins/index'
import {
  getAfficheList,
  deleteAffiche,
  editAffiche,
  editAfficheOrder,
  editAfficheIsShow
} from '@/api/method/affiche'
export default {
  name: '',
  mixins: [_mixins],
  data() {
    return {
      params: {
        current: 1,
        size: 10,
        total: 0
      },
      dict: _dict,
      tableData: [],
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
    setHeigthFn(v) {
      return document.body.clientHeight - v + ''
    },
    getListFn() {
      getAfficheList(this.params).then((res) => {
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
      editAfficheOrder(this.one.id, this.one.orderValue)
        .then((res) => {
          res.code === 10000 &&
            (this.$message.success('修改成功'),
            (this.$refs['orderDialog'].visible = false))
        })
        .catch(() => {})
    },

    orderDialogFn(v) {
      this.one = v
      this.$refs['orderDialog'].visible = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
