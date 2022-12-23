<template>
  <div class="router_container2 m20 bg-w f fd-c">
    <div class="panel-header-box">
      <div class="title-css">顶部广告图管理</div>
    </div>
    <div class="p10 f1 f fd-c" style="overflow-y: auto">
      <div class="f jc-sb ai-c mv10">
        <div class="fs18 fw600 title-c-1 ti5">广告图列表</div>
      </div>
      <el-table
        :data="tableData"
        border
        :height="setHeigthFn(360)"
        :header-cell-style="{ background: '#eaeaea' }"
        style="width: 100%"
      >
        <el-table-column prop="title" label="标题" />

        <el-table-column prop="isShow" label="显示状态" width="80">
          <template slot-scope="scope">
            {{ $dict.isShow[scope.row.isShow ? 1 : 0] }}
          </template>
        </el-table-column>
        <el-table-column prop="isShow" label="是否显示" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              active-color="#4caf50"
              inactive-color="#eeeeee"
              :active-value="true"
              :inactive-value="false"
              @change="editShow(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goPage(`/topAdvertisementDetail/${scope.row.id}`)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTopAd, setTopAdShow } from "@/api/method/topAdvertising";
export default {
  name: "",
  data() {
    return {
      params: {
        current: 1,
        size: 10,
        total: 0,
      },
      tableData: [],
    };
  },
  mounted() {
    this.getFn();
  },
  methods: {
    setHeigthFn(v) {
      return document.body.clientHeight - v + "";
    },
    goPage(path, query) {
      this.$router.push(path);
    },
    getFn() {
      getTopAd().then((res) => {
        res.code === 10000 && (this.tableData = [res.data]);
      });
    },
    editShow(v) {
      console.log("vv", v);
      setTopAdShow(v.id, v.isShow)
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
