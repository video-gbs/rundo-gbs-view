<template>
  <div class="router_container2 m20 bg-w f fd-c">
    <div class="panel-header-box">
      <div class="title-css">广告图管理</div>
    </div>
    <div class="p10 f1 f fd-c" style="overflow-y: auto">
      <div class="f jc-sb ai-c mv10">
        <div class="fs18 fw600 title-c-1 ti5">广告图列表</div>
        <el-button
          size="mini"
          type="primary"
          @click="goPage('/advertisementPicture/add')"
          >新增</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        :height="setHeigthFn(360)"
        :header-cell-style="{ background: '#eaeaea' }"
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="orderValue" label="显示顺序" width="80" />
        <el-table-column prop="isShow" label="显示状态" width="80">
          <template slot-scope="scope">
            {{ $dict.isShow[scope.row.isShow] }}
          </template>
        </el-table-column>
        <el-table-column prop="isShow" label="是否显示" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              active-color="#4caf50"
              inactive-color="#eeeeee"
              :active-value="1"
              :inactive-value="0"
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
              @click="goPage(`/advertisementPicture/${scope.row.id}`)"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="deleteFn(scope.row, remove, getAdvertisingListFn)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <setOrderVue
        ref="orderDialog"
        :config="one"
        :fn="editOrder"
        @refreshFn="getAdvertisingListFn"
      />
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
import _mixins from "@/mixins/index";
import {
  getAdvertisingList,
  editAdvertisingOrder,
  editAdvertisingShow,
  deleteAdvertising,
} from "@/api/method/advertising";
import setOrderVue from "@/components/setOrder/setOrder.vue";
export default {
  name: "",
  components: { pagination, setOrderVue },
  mixins: [_mixins],
  data() {
    return {
      params: {
        current: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
      one: {},
      remove: deleteAdvertising,
      editShow: editAdvertisingShow,
    };
  },
  mounted() {
    this.getAdvertisingListFn();
  },
  methods: {
    setHeigthFn(v) {
      return document.body.clientHeight - v + "";
    },
    sizeChange(v) {
      console.log("v");
      // 执行搜索
    },
    currentChange(v) {
      console.log("v2");
      // 执行搜索
    },
    goPage(path, query) {
      this.$router.push(path);
    },
    getAdvertisingListFn() {
      getAdvertisingList(this.params).then((res) => {
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
      editAdvertisingOrder(v.id, v.orderValue)
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
