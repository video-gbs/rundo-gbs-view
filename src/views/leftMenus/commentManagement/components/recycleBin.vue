<!--评论回收站-->
<template>
  <div>
    <div class="seach">
      <Seach
        :form-list="FormList"
        :query="query"
        @submitSearch="submitSearch"
        @submitReset="toReset"
      />
    </div>
    <div class="footer-table mt20 f1 f fd-c ai-c">
      <ComTabble
        ref="comTableRef"
        width="100%"
        :page-size="query.pageSize"
        :page-num="query.pageNum"
        :header-style="headerStyle"
        :max-height="'auto'"
        :table-items="tableItems"
        :table-data="tableData"
        :button-items="buttonItems"
        :height-table="'auto'"
        @handleClick="handleClick"
      />
      <Pagination
        :pages-data="query"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<script>
import Seach from "@/components/Seach/index.vue";
import ComTabble from "@/components/ComTabble/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import {
  getReviewList,
  reallyDeleteReview,
  refreshReview,
} from "@/api/method/commentManagement";

export default {
  name: "",
  components: { Seach, ComTabble, Pagination },
  data() {
    return {
      query: {
        auditStatus: "",
        content: "",
        delFlag: 1,
        endTime: "",
        field: [],
        isShow: "",
        order: false,
        pubUsername: "",
        startTime: "",
        title: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      headerStyle: {
        background: "#EAEAEA",
        fontsize: "14px",
        fontWeight: 400,
        color: "#333333",
      },
      FormList: [
        {
          poro: "title",
          type: "input",
          label: "问政标题",
          size: "small",
          width: "300px",
        },
        {
          poro: "content",
          type: "input",
          label: "评论内容",
          size: "small",
          width: "180px",
        },
        {
          poro: "pubUsername",
          type: "input",
          label: "提交人",
          size: "small",
          width: "180px",
        },

        {
          poro: "isShow",
          type: "select",
          label: "显示状态",
          size: "small",
          width: "216px",
          propsConfig: {
            checkStrictly: true,
            multiple: true,
          },
          optionsList: this.$dict._isShow,
        },

        {
          poro: "startTime",
          type: "dateRange",
          label: "提交时间",
          size: "small",
          width: "300px",
        },
      ],
      // 表格参数
      buttonItems: {
        options: [
          {
            text: "详情",
            cb: "verify",
            // icon: 'el-icon-view'
          },
          {
            text: "恢复数据",
            cb: "refreshData",
            // icon: 'el-icon-view'
          },
          {
            text: "永久删除",
            cb: "reallyDelete",
            // icon: 'el-icon-delete',

            visible: true,
          },
        ],
        label: "操作",
        width: "200px",
      },
      tableItems: [
        {
          label: "编号",
          name: "id",
          width: "100",
          isShow: true,
        },
        {
          label: "标题",
          name: "title",
          width: "200",
          isShow: true,
        },
        {
          label: "评论内容",
          name: "content",
          isShow: true,
        },
        {
          label: "提交人",
          name: "submitName",
          isShow: true,
        },
        {
          label: "状态",
          name: "stauts",
          isShow: true,
        },
        {
          label: "是否可见",
          name: "isShow",
          isShow: true,
        },
        {
          label: "提交时间",
          name: "createdTime",
          isShow: true,
        },
      ],
      tableData: [],
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      const p = Object.assign({}, this.query);
      if (this.query.startTime && this.query.startTime.length) {
        p.startTime = this.query.startTime[0];
        p.endTime = this.query.startTime[1];
      } else {
        p.startTime = "";
        p.endTime = "";
      }
      getReviewList(p).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data.rows;
          this.query.total = res.data.total;
        }
      });
    },
    handleClick(v) {
      this[v.cb](v.row);
    },
    verify(v) {
      this.$router.push(`/commentDetail/${v.affairsId}`);
    },

    reallyDelete(v) {
      this.$alert(
        `确定要删除 '${v.title || v.realName || v.name}' 吗?`,
        "删除操作",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
        }
      ).then((action) => {
        reallyDeleteReview(v.id).then((res) => {
          res.code === 10000 &&
            (this.$message.success("删除成功"), this.getDataList());
        });
      });
    },
    refreshData(v) {
      this.$alert(
        `是否要恢复 '${v.title || v.realName || v.name}' 的数据?`,
        "恢复操作",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
        }
      ).then((action) => {
        refreshReview(v.id).then((res) => {
          res.code === 10000 &&
            (this.$message.success("恢复成功"), this.getDataList());
        });
      });
    },
    submitSearch(val) {
      this.query = val;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },
    toReset(val) {
      this.query = val;
      this.query.pageNum = 1;
      this.query.pageSize = 10;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },

    // 分页
    sizeChange(v) {
      this.query.pageSize = v;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },
    currentChange(v) {
      this.query.pageNum = v;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },
    // 分页
    // 表格参数
    // 表格参数
  },
};
</script>
<style lang="scss" scoped>
.seach {
  // margin: 20px 24px;
  // padding: 32px 20px 10px 20px;
  box-shadow: 0px 2px 6px 1px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  background: #ffffff;
}
</style>
