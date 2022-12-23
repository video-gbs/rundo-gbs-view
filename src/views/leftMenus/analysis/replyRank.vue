<!--回复排行-->
<template>
  <div class="bg-w p10 f fd-c">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">回复排行</div>
      <div class="f ai-c jc-c">
        <el-select v-model="yearSearch" class="mr10" placeholder="请选择年份">
          <el-option
            v-for="i in selectDate"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          />
        </el-select>
        <el-button size="mini" type="primary">查询</el-button>
      </div>
    </div>
    <div class="content-box f1 p10">
      <!--市级领导-->
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="headerStyle"
        class="mb10"
      >
        <el-table-column label="市级单位统计">
          <el-table-column prop="date" label="单位" />
          <el-table-column prop="name" label="留言数" width="180" />
          <el-table-column prop="address" label="已回复" />
          <el-table-column prop="address" label="回复率" />
        </el-table-column>
      </el-table>

      <!--一般单位-->
      <el-table
        :data="tableData2"
        style="width: 100%"
        :header-cell-style="headerStyle"
        :index="indexMethod"
      >
        <el-table-column label="回复排行">
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column prop="date" label="单位" />
          <el-table-column prop="name" label="留言数" width="180" />
          <el-table-column prop="address" label="受理数" />
          <el-table-column prop="address" label="已回复" />
          <el-table-column prop="address" label="逾期未回复" />
          <el-table-column prop="address" label="回复率" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "ReplyRank",

  data() {
    return {
      yearSearch: new Date().getFullYear(),
      selectDate: (function () {
        const arr = [];
        let newD = new Date().getFullYear();
        for (let i = 0; i < 3; i++) {
          arr.push({ value: newD, label: `${newD}年` });
          newD--;
        }
        return arr;
      })(),
      indexMethod(index) {
        return index + 1;
      },
      headerStyle: {
        background: "#EAEAEA",
        fontsize: "14px",
        fontWeight: 400,
        color: "#333333",
      },
      query: {
        pageSize: 2,
        pageNum: 1,
      },
      tableItems: [],
      tableData: [],
      query2: {
        pageSize: 10,
        pageNum: 1,
      },
      tableItems2: [],
      tableData2: [],
    };
  },
};
</script>
<style lang="scss" scoped></style>
