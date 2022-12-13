<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box">
      <div class="title-css">轮播图管理</div>
    </div>
    <div class="p10">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column>
          <template slot="header">
            <div class="f ai-c jc-sb">
              <div>数据列表</div>
              <el-button
                size="mini"
                type="primary"
                @click="goPage('/roundChart/add')"
                >新增</el-button
              >
            </div>
          </template>
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="orderValue" label="显示顺序" width="80" />
          <!-- <el-table-column

            label="显示状态"
            width="80"
          >
            <template slot-scope="scope">
              {{ $dict.isShow[scope.row.isShow] }}
            </template>
          </el-table-column> -->
          <el-table-column prop="isShow" label="是否显示" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isShow"
                active-color="#4caf50"
                inactive-color="#eeeeee"
                :active-value="0"
                :inactive-value="1"
                @change="editShowFn(scope.row, editShow)"
              />
              <!-- {{ dict.isShow[scope.row.isShow] }} -->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column width="200" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="orderDialogFn(scope.row)"
                >显示顺序</el-button
              >
              <!-- <el-button type="text">设为可见</el-button> -->
              <el-button
                type="text"
                @click="goPage(`/roundChart/${scope.row.id}`)"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="deleteFn(scope.row, remove, getList)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
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
    <setOrderVue
      ref="orderDialog"
      :config="one"
      :fn="editOrder"
      @refreshFn="getList"
    />
  </div>
</template>

<script>
import {
  getRoundChartList,
  deleteRoundChart,
  editRoundChart,
  slideShowOrder,
  slideIsShow,
} from "@/api/method/roundChart";
import _mixins from "@/mixins/index";

import setOrderVue from "@/components/setOrder/setOrder.vue";
export default {
  name: "",
  components: { setOrderVue },
  mixins: [_mixins],
  data() {
    return {
      params: {
        current: 1,
        // 'isShow': 0,
        // 'orderValue': 0,
        // 'related': 0,
        size: 10,
        // 'title': '',
        // 'total': 0
      },
      tableData: [],
      show: false,
      one: {},
      remove: deleteRoundChart,
      editShow: slideIsShow,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // handleSizeChange(v) {
    //   console.log('v')
    //   this.params.size=v
    //   this.getList()
    //   // 执行搜索
    // },
    // paginationCurrentChange(v) {
    //   console.log('v2')
    //   this.params.current=v
    //   this.getList()
    //   // 执行搜索
    // },
    goPage(path, query) {
      this.$router.push(path);
    },
    getList() {
      getRoundChartList(this.params).then((res) => {
        console.log("754", res);
        res.code === 10000 &&
          ((this.tableData = res.data.records),
          (this.params.total = res.data.total));
      });
    },
    orderDialogFn(v) {
      this.one = v;
      this.$refs["orderDialog"].visible = true;
    },
    editOrder(v) {
      console.log("vv", v);
      slideShowOrder(v.id, v.orderValue)
        .then((res) => {
          res.code === 10000 &&
            (this.$message.success("修改成功"),
            (this.$refs["orderDialog"].visible = false));
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
