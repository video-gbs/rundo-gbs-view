<!--问政评论列表-->
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
    <PDialog ref="commentRef" @submit="examineFn">
      <template slot="title">审核评论</template>
      <template slot="main">
        <el-form
          ref="commentForm"
          :model="checkParams"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="审核结果">
            <el-radio v-model="checkParams.auditResult" :label="1"
              >审核通过</el-radio
            >
            <el-radio v-model="checkParams.auditResult" :label="0"
              >审核未通过</el-radio
            >
            <el-input v-model="checkParams.auditResult" />
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="checkParams.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
  </div>
</template>
<script>
import Seach from "@/components/Seach/index.vue";
import ComTabble from "@/components/ComTabble/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import PDialog from "@/components/PDialog/index.vue";
import {
  getReviewList,
  auditReview,
  deleteReview,
} from "@/api/method/commentManagement";
export default {
  name: "",
  components: { Seach, ComTabble, Pagination, PDialog },
  data() {
    return {
      query: {
        auditStatus: "",
        content: "",
        delFlag: 0,
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
      checkParams: {
        auditResult: 1,
        content: "",
        id: "",
      },
      rules: {
        content: [
          {
            validator: (rule, value, callback) => {
              if (this.checkParams.auditResult === 0) {
                if (this.checkParams.content.replace(/\s*/g, "") === "") {
                  callback(new Error("请输入不用通过的原因"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
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
            text: "评论审核",
            cb: "examine",
            // icon: 'el-icon-view',
            visible: {
              attrName: "auditStatus",
              fn: function (v) {
                return v === 2;
              },
            },
          },
          {
            text: "设为可见",
            cb: "replyCheck",
            // icon: 'el-icon-view',
            visible: {
              attrName: "isShow",
              fn: function (v) {
                return v === 0;
              },
            },
          },
          {
            text: "设为隐藏",
            cb: "replyCheck",
            // icon: 'el-icon-view',
            visible: {
              attrName: "isShow",
              fn: function (v) {
                return v === 1;
              },
            },
          },
          {
            text: "详情",
            cb: "verify",
            // icon: 'el-icon-view'
          },
          {
            text: "删除",
            cb: "deletItem",
            // icon: 'el-icon-delete',
            className: "isRed",
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
    submitSearch(val) {
      this.query = val;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },
    handleClick(v) {
      this[v.cb](v.row);
    },
    examine(v) {
      this.checkParams.id = v.id;
      this.$refs["commentRef"].visible = true;
    },
    examineFn() {
      this.$refs["commentForm"].validate((v) => {
        if (v) {
          auditReview(this.checkParams).then((res) => {
            if (res.code === 10000) {
              this.$message.success("审核成功");
              this.$refs["commentRef"].visible = false;
              this.getDataList();
            }
          });
        }
      });
    },
    verify(v) {
      this.$router.push(`/commentDetail/${v.id}/${v.affairsId}`);
    },
    deleteItem(v) {
      this.$alert(
        `确定要删除 '${v.title || v.realName || v.name}' 吗?`,
        "删除操作",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
        }
      ).then((action) => {
        deleteReview(v.id).then((res) => {
          res.code === 10000 &&
            (this.$message.success("删除成功"), this.getDataList());
        });
      });
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
