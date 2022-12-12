<template>
  <div v-if="!this.showDetails" class="projectManagement">
    <div class="seach">
      <Seach
        :form-list="FormList"
        :query="query"
        @submitSearch="submitSearch"
        @submitReset="toReset"
      />
    </div>
    <div class="footer-table">
      <div class="tab-table">
        <ComTabble
          ref="comTableRef"
          :index="index"
          :page-size="query.pageSize"
          :page-num="query.pageNum"
          :selection="selection()"
          :header-style="headerStyle"
          :max-height="maxHeight"
          :left-title="leftTitle"
          :table-items="tableItems"
          :table-data="tableData"
          :button-items="buttonItems"
          :is-checked-header="isCheckedHeader"
          :header-btn="headerBtn"
          :checked-header.sync="checkedHeader"
          @handleClick="handleClick"
          @haederBtnClick="haederBtnClick"
          @changeTableHeader="changeTableHeader"
          @selection-change="handleSelectionChange"
        />
        <Pagination
          :pages-data="query"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Seach from "@/components/Seach/index.vue";
import ComTabble from "@/components/ComTabble/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import { unitList } from "@/api/method/unitManagement";
import { affairsInfoList } from "@/api/method/politicalList";
import { reallyDeleteAffairs, editAffairs } from "@/api/method/affairs";

export default {
  name: "ProjectManagementRecycle",
  components: {
    Seach,
    ComTabble,
    Pagination,
  },
  data() {
    const _that = this;
    console.log("d");
    const checkContent = function (rule, value, callback) {
      if (_that[_that.paramsObj].auditResult === 2) {
        if (value === "") {
          callback(new Error("请输入审核不通过的原因。"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      showDetails: false,
      headerStyle: {
        background: "#EAEAEA",
        fontsize: "14px",
        fontWeight: 400,
        color: "#333333",
      },
      // 搜索栏配置

      FormList: [
        {
          poro: "title",
          type: "input",
          label: "标题",
          size: "small",
          width: "300px",
        },
        {
          poro: "type",
          type: "select",
          label: "分类",
          size: "small",
          width: "180px",
          optionsList: this.$dict._type,
        },
        {
          poro: "domain",
          type: "select",
          label: "领域",
          size: "small",
          width: "180px",
          propsConfig: {
            checkStrictly: true,
            multiple: true,
          },
          optionsList: this.$dict._domain,
        },
        {
          poro: "deptId",
          type: "select",
          label: "留言对象",
          size: "small",
          width: "216px",
          propsConfig: {
            checkStrictly: true,
            multiple: true,
          },
          optionsList: [],
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
          poro: "pubUsername",
          label: "发布账号",
          size: "small",
          type: "input",
          width: "300px",
          propsConfig: {
            checkStrictly: true,
            multiple: true,
          },
          optionsList: [],
        },
        {
          poro: "phone",
          type: "input",
          label: "电话",
          size: "small",
          width: "180px",
          propsConfig: {
            checkStrictly: true,
            multiple: true,
          },
          optionsList: [],
        },
      ],
      comTableLoading: false,
      // 搜索from
      query: {
        deptId: "",
        deptType: "",
        domain: "",
        endTime: "",
        // field: [],
        // fileBatchId: 0,
        isDeleted: 1,
        isReview: "",
        isShow: "",
        order: false,
        phone: "",
        pubUsername: "",
        realName: "",
        startTime: "",
        status: "",
        statusList: [],
        title: "",
        type: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0,
      },
      // 高级搜索
      isLoading: false,
      // 表单数据
      index: true,
      tableItems: [
        {
          label: "编号",
          name: "id",
          width: "100",
          isShow: true,
          isBold: false,
        },
        {
          label: "标题",
          name: "title",
          width: "200",
          isShow: true,
        },
        {
          label: "分类",
          name: "type",
          content: "type",
          isShow: true,
          width: "80",
        },
        {
          label: "留言对象",
          name: "deptName",
          isShow: true,
        },
        {
          label: "发布账号",
          name: "username",
          isShow: true,
        },
        {
          label: "手机号",
          name: "phone",
          isShow: true,
        },
        {
          label: "提交时间",
          name: "createTime",
          isShow: true,
          width: "120",
        },
        {
          label: "状态",
          name: "status",
          isShow: true,
          content: "status",
          width: "80",
        },
        {
          label: "受理单位",
          name: "processingDeptName",
          isShow: true,
        },
        // {
        //   label: '是否可见',
        //   name: 'isShow',
        //   isShow: true,
        //   type: 'switch',
        //   disabled: {
        //     attrName: 'status',
        //     fn: function(v) {
        //       console.log('只是多少', v)
        //       // v 是传入的值 用这个值来判断return的布尔值
        //       return [2, 3].includes(v)
        //     }
        //   },
        //   content: '',
        //   fnName: 'setShow',
        //   width: '80'
        // },
        // {
        //   label: '评论区',
        //   name: 'isReview',
        //   isShow: true,
        //   disabled: {
        //     attrName: 'status',
        //     fn: function(v) {
        //       console.log('只是多少', v)
        //       // v 是传入的值 用这个值来判断return的布尔值
        //       return [2, 3].includes(v)
        //     }
        //   },
        //   type: 'switch',
        //   content: '',
        //   fnName: 'setReview',
        //   width: '80'
        // }
      ],
      leftTitle: "",
      maxHeight: "800",
      tableData: [],
      // 分页器内容
      pagesData: {
        account: "",
        deptId: "",
        deptType: "",
        domain: "",
        endTime: "",
        field: [],
        fileBatchId: 0,
        isDeleted: 0,
        isReview: 0,
        isShow: "",
        order: true,
        pageNum: 1,
        pageSize: 10,
        phone: "",
        pubUsername: "",
        realName: "",
        startTime: "",
        status: "",
        title: "",
        type: "",
        total: 0,
        proCount: 0,
      },
      buttonItems: {
        options: [
          {
            text: "详情",
            cb: "verify",
            // icon: 'el-icon-view'
          },
          {
            text: "恢复数据",
            cb: "recoverData",
            // icon: 'el-icon-view',
          },
          {
            text: "永久删除",
            cb: "reallyDelete",
            // icon: 'el-icon-delete',
          },
        ],
        label: "操作",
        width: "200px",
      },
      activeName: "",
      dialogVisible: false,
      dialogTitle: "项目详情",
      baseList: [],
      selectionList: [],
      checkedHeader: [],
      isCheckedHeader: true,
      headerBtn: [],
      fileList: [],
      isLoding: false,
      paramsObj: "", // 接口的对象名
      paramsFormRef: "", // 表格对象ref
      paramsForm: "", // dialog组件的ref
      auditResultRules: {
        // 审核不通过时候 必须校验 审核说明字段不能为空
        content: [{ validator: checkContent, trigger: ["blur", "change"] }],
      },
      // 弹出层
      examineForm: {
        // 问政审核参数
        affairsId: "",
        auditResult: 1,
        content: "",
      },
    };
  },
  computed: {},
  watch: {
    // ??????
    query: {
      handler: function (n) {
        this.getDataList();
      },
    },
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getDataList();
      this.getDeptFn();
    },
    getDataList() {
      this.$refs["comTableRef"].isLoading_ = true;
      affairsInfoList(this.query)
        .then((res) => {
          if (res.code === 10000) {
            this.tableData = res.data ? res.data.rows : [];
            this.query.total = res.data.total || 0;
          }
        })
        .finally(() => {
          this.$refs["comTableRef"].isLoading_ = false;
        });
    },
    getDeptFn() {
      // 获取部门
      unitList({ current: 1, size: 3000 }).then((res) => {
        if (res.code === 10000) {
          0;
          this.FormList.forEach((i) => {
            if (i.poro === "deptId") {
              i.optionsList = res.data.records.map((l) => {
                return { value: l.id, label: l.name };
              });
            }
          });
        }
      });
    },
    submitSearch() {
      this.getDataList();
    },
    toReset(val) {
      this.query = val;
      this.query.pageNum = 1;
      this.query.pageSize = 10;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },

    reallyDelete(obj) {
      // 永久删除
      this.$confirm(
        `是否永久删除标题为“${obj.row.title}”的问政信息，删除后无法恢复`,
        "删除提示",
        {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          reallyDeleteAffairs(obj.row.id).then((res) => {
            if (res.code === 10000) {
              this.$message.success("删除成功！");
              this.getDataList();
              return;
            }
            this.$message.warning(res.message);
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    recoverData(obj) {
      // 恢复数据
      this.$confirm(
        `是否恢复标题为“${obj.row.title}”的问政数据？`,
        "恢复数据",
        {
          confirmButtonText: "确定恢复",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          editAffairs({ id: obj.row.id, isDeleted: 0 }).then((res) => {
            if (res.code === 10000) {
              this.$message.success("恢复成功！");
              this.getDataList();
              return;
            }
            this.$message.warning(res.message);
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    handleClick(v) {
      this[v.cb](v);
    },
    // 查看详情
    verify(val) {
      console.log("xq", val);
      this.$router.push(`/recycleBin/${val.row.id}`);
    },

    // 每页显示条目个数
    sizeChange(val) {
      this.query.pageSize = val;
      this.getDataList();
    },
    // 当前页数
    currentChange(val) {
      this.query.pageNum = val;
      this.getDataList();
    },

    selection() {
      return false;
    },
    handleSelectionChange() {},
    changeTableHeader() {},
    haederBtnClick() {},
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
  color: #333;
  font-size: 14px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
}

.projectManagement {
  position: relative;
  text-align: left;
  height: 100%;

  .top-title {
    position: relative;
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    padding-left: 35px;
    text-align: left;
    font-size: 18px;
    font-family: "Source Han Sans CN", "Source Han Sans CN-Medium";
    font-weight: 500;

    &::before {
      position: absolute;
      display: block;
      content: "";
      left: 25px;
      top: 22px;
      width: 3px;
      height: 16px;
      background: #0080e2;
    }
  }

  .seach {
    // margin: 20px 24px;
    // padding: 32px 20px 10px 20px;
    box-shadow: 0px 2px 6px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    background: #ffffff;
  }

  .footer-table {
    margin-top: 20px;
    background: #ffffff;

    .btn-content {
      height: 80px;
      line-height: 80px;
      padding: 0 20px 0 40px;
    }

    .tab-table {
      // padding: 0 20px 20px 20px;
    }
  }

  .top-exect {
    height: 50px;
    line-height: 50px;
  }

  .projectDetai {
    position: fixed;
    top: 82px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 84px);
    background: #f6f6f6;
    z-index: 11;

    .breadcrumb-top {
      height: 60px;
      line-height: 60px;
      background: #ffffff;
      padding-left: 20px;
      padding-right: 20px;

      .el-breadcrumb {
        line-height: 60px;
        font-size: 16px;
        font-family: "Source Han Sans CN, Source Han Sans CN-Regular";
        font-weight: 400;

        .el-breadcrumb__item {
          &:first-child {
            color: #9e9e9e;

            .el-breadcrumb__inner {
              color: #9e9e9e !important;
              cursor: pointer;
            }
          }
        }
      }

      :last-child {
        span {
          font-size: 25px;
          line-height: 60px;
          cursor: pointer;
        }
      }
    }

    .projectDetai-content {
      margin: 20px;
      // padding: 0 20px 20px 20px;
      background: #ffffff;
      height: calc(100vh - 184px);
      // overflow: hidden;
      // overflow-x: auto;
    }

    // .footer-btn {
    //   position: fixed;
    //   left: 20px;
    //   bottom: 20px;
    //   width: calc(100vw - 40px);
    //   height: 80px;
    //   line-height: 80px;
    //   background: #ffffff;
    //   border-radius: 0px 0px 4px 4px;
    //   box-shadow: 0px -2px 6px 0px undefined;
    //   z-index: 12;
    //   text-align: right;
    //   // padding-right: 20px;
    //   // box-shadow: 0px -2px 6px 0px 6px;
    //   .el-button {
    //     margin-right: 0;
    //     &:last-child {
    //       margin-right: 60px;
    //     }
    //   }
    // }
  }
}

.top-exect {
  height: 50px;
  line-height: 50px;
}

.left_title {
  margin-right: 20px;
}

.exect_file {
  margin-bottom: 20px;
}

.upload-file {
  margin-left: 75px;
}

.item-list {
  font-family: "Source Han Sans CN", "Source Han Sans CN-Regular";
  font-weight: 400;
  font-size: 16px;
  line-height: 40px;
  margin-bottom: 20px;

  .title {
    // display: inline-block;
    vertical-align: top;
    color: #666666;
    padding-right: 20px;
  }

  .list {
    display: inline-block;

    .item {
      font-size: 16px;
      margin-top: 5px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      height: 30px;
      line-height: 30px;

      .el-icon-picture-outline {
        color: rgba(0, 129, 227, 1);
      }

      .item-name {
        color: #666666;
        display: inline-block;
        width: 260px;
        padding-left: 10px;
        vertical-align: bottom;
      }

      .item-edit {
        color: rgba(0, 129, 227, 1);
        padding-right: 10px;
        cursor: pointer;
      }

      .item-delect {
        color: rgba(230, 65, 65, 1);
        cursor: pointer;
      }
    }
  }
}
</style>
