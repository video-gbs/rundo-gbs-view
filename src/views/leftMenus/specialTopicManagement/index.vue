<!--专题管理-->
<template>
  <div class="f fd-c ai-s">
    <div class="p10 bg-w user-panel-action-box f ai-c jc-sb">
      <div class="title-css">专题管理</div>
      <div class="f1 f ai-c jc-e fw-w">
        <div class="fs14 mr10">标题</div>
        <el-input
          v-model="search.title"
          style="width: 400px"
          class="mr10"
          size="mini"
          placeholder="请输入标题"
        />

        <div class="fs14 mr10">创建时间</div>
        <el-date-picker
          v-model="search.timeRange"
          style="width: 250px"
          class="mr10"
          size="mini"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />

        <el-button size="mini" type="primary" @click="searchBtn"
          >查询</el-button
        >
        <el-button size="mini" @click="resetBtn">重置</el-button>
        <div class="mh10" style="height: inherit; width: 1px; color: #ddd">
          |
        </div>
        <el-button size="mini" type="primary" @click="addItem">新增</el-button>
      </div>
    </div>
    <div class="content-box mt10 p10 f1 f fd-c bg-w">
      <ComTabble
        ref="comTableRef"
        class="f1"
        width="100%"
        :page-size="search.pageSize"
        :page-num="search.pageNum"
        :header-style="headerStyle"
        :max-height="'auto'"
        :table-items="tableItems"
        :table-data="tableData"
        :button-items="buttonItems"
        :height-table="'auto'"
        @handleClick="handleClick"
        @sortChange="sortChange"
        @setShow="setShow"
      />
      <Pagination
        :pages-data="search"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<script>
import ComTabble from "@/components/ComTabble/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import { getList, deleteItem, setItemShow } from "@/api/method/specialTopic";
export default {
  name: "",
  components: { ComTabble, Pagination },
  data() {
    return {
      search: {
        field: [],
        order: false, // false表示降序
        startTime: "",
        endTime: "",
        title: "",
        pageSize: 10,
        pageNum: 1,
        timeRange: [],
      },
      headerStyle: {
        background: "#EAEAEA",
        fontsize: "14px",
        fontWeight: 400,
        color: "#333333",
      },
      tableItems: [
        {
          label: "标题",
          name: "title",

          isShow: true,
        },
        {
          label: "评论数",
          name: "commentCount",
          isShow: true,
          width: "200",
        },

        {
          label: "是否可见",
          name: "isShow",
          isShow: true,
          type: "switch",
          content: "",
          fnName: "setShow",
          width: "80",
        },
        {
          label: "创建时间",
          name: "createTime",
          isShow: true,
          sortable: "custom",
          width: "200",
        },
      ],
      tableData: [],
      buttonItems: {
        options: [
          {
            text: "详情",
            cb: "verify",
            // icon: 'el-icon-view'
          },
          {
            text: "编辑",
            cb: "editItem",
            // icon: 'el-icon-view',
          },
          {
            text: "删除",
            cb: "deleteItem",
            // icon: 'el-icon-delete',
          },
        ],
        label: "操作",
        width: "200px",
      },
    };
  },
  mounted() {
    this.getListFn();
  },
  methods: {
    searchBtn() {
      const p = Object.assign({}, this.search);
      if (p.timeRange && p.timeRange.length) {
        p.startTime = p.timeRange[0];
        p.endTime = p.timeRange[1];
      }
      delete p.timeRange;
      this.getListFn(p);
    },
    resetBtn() {
      this.search = {
        field: [],
        order: false, // false表示降序
        startTime: "",
        endTime: "",
        title: "",
        pageSize: 10,
        pageNum: 1,
        timeRange: [],
      };
    },
    getListFn(p) {
      getList(p || this.search).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data.rows;
          this.search.total = res.data.total;
        }
      });
    },
    sortChange(p, s) {
      // p 排序的字段
      // s =descending/ascending  降序 升序
      this.search.order = s !== "descending";
      this.getListFn();
    },
    addItem() {
      this.$router.push("/specialTopic/add");
    },
    editItem(v) {
      this.$router.push(`/specialTopic/${v.id}`);
    },
    deleteItem(v) {
      // deleteItem
      this.$alert(`确定要删除 '${v.title}' 吗?`, "删除操作", {
        dangerouslyUseHTMLString: true,
        showCancelButton: true,
      }).then((action) => {
        deleteItem({ ids: [v.id] }).then((res) => {
          if (res.code === 10000) {
            this.$message.success("删除成功。");
            this.getListFn();
          }
        });
      });
    },
    setShow(v) {
      console.log("vvvv", v);
      setItemShow(v.id)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success("设置成功");
            return;
          }
          v.isShow = v.isShow ? 0 : 1;
        })
        .catch(() => {
          v.isShow = v.isShow ? 0 : 1;
        });
    },
    verify(v) {
      this.$router.push(`/specialTopicDetail/${v.id}`);
    },
    handleClick(v) {
      this[v.cb](v.row);
    },
    sizeChange(v) {
      this.search.pageSize = v;
      this.getListFn();
    },
    currentChange(v) {
      this.search.pageNum = v;
      this.getListFn();
    },
  },
};
</script>
<style lang="scss" scoped>
.user-panel-action-box {
  width: 100%;
}
.content-box {
  width: 100%;
  overflow-y: auto;
}
</style>
