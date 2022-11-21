<template>
  <div class="projectManagement" v-if="!this.showDetails">
    <div class="seach">
      <Seach
        :FormList="FormList"
        :query="query"
        @submitSearch="submitSearch"
        @submitReset="toReset"
      />
    </div>
    <div class="footer-table">
      <div class="tab-table">
        <ComTabble
          :index="index"
          :pageSize="pagesData.pageSize"
          :pageNum="pagesData.pageNum"
          :selection="selection"
          :headerStyle="headerStyle"
          :isLoading="isLoading"
          :MaxHeight="maxHeight"
          :leftTitle="leftTitle"
          :tableItems="tableItems"
          :tableData="tableData"
          :buttonItems="buttonItems"
          :isCheckedHeader="isCheckedHeader"
          :headerBtn="headerBtn"
          :checkedHeader.sync="checkedHeader"
          @haederBtnClick="haederBtnClick"
          @handleClick="handleClick"
          @changeTableHeader="changeTableHeader"
          @selection-change="handleSelectionChange"
        />
        <Pagination
          :pagesData="pagesData"
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
export default {
  components: {
    Seach,
    ComTabble,
    Pagination
  },
  name: "projectManagement",
  data() {
    return {
      showDetails: false,
      headerStyle: {
        background: "#EAEAEA",
        fontsize: "14px",
        fontWeight: 400,
        color: "#333333"
      },
      // 搜索栏配置
      FormList: [
        {
          poro: "projectName",
          type: "input",
          label: "标题：",
          size: "small"
        },
        {
          poro: "projectSubName",
          type: "input",
          label: "分类：",
          size: "small"
        },
        {
          poro: "area",
          type: "addressCascader",
          label: "领域：",
          size: "small",
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        },
        {
          poro: "renovateType",
          type: "addressCascader",
          label: "留言对象：",
          size: "small",
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        },

        {
          poro: "projectState",
          type: "addressCascader",
          label: "显示状态：",
          size: "small",
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        },
        {
          poro: "declareYear",
          label: "发布账号：",
          size: "small",
          type: "addressCascader",
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        },
        {
          poro: "moneySource",
          type: "addressCascader",
          label: "电话：",
          size: "small",
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        }
      ],
      // 搜索from
      query: {
        projectName: "",
        projectState: "",
        renovateType: "",
        declareYear: "",
        areaCounty: "",
        moneySource: "",
        areaCity: "",
        area: "",
        radio: ""
      },
      // 高级搜索
      isLoading: false,
      maxHeight: "430",
      // 表单数据
      index: true,
      selection: true,
      leftTitle: "",
      tableItems: [
        {
          label: "编号",
          name: "projectName",
          width: "100",
          isShow: true,
          isBold: false
        },
        {
          label: "标题",
          name: "projectSubName",
          width: "200",
          isShow: true
        },
        {
          label: "分类",
          name: "area",
          isShow: true
        },
        {
          label: "留言对象",
          name: "declareYear",
          isShow: true
        },
        {
          label: "发布账号",
          name: "moneySourceName",
          isShow: true
        },
        {
          label: "电话",
          name: "carryTerm",
          isShow: true
        },
        {
          label: "提交时间",
          name: "renovateTypeName",
          isShow: true
        },
        {
          label: "状态",
          name: "projectStateName",
          isShow: true
        },
        {
          label: "受理单位",
          name: "contacts",
          isShow: true
        },
        {
          label: "是否可见",
          name: "restoreContent",
          isShow: true,
          content: "test"
        },
        {
          label: "评论区",
          name: "workPlan",
          isShow: true,
          content: "test1"
        }
      ],
      isFullscreen: false,
      tableData: [
        {
          label: "编号",
          projectName: "测试",
          label: "标题",
          projectSubName: "测试",

          label: "分类",
          area: "测试",
          label: "留言对象",
          declareYear: "测试",
          label: "发布账号",
          moneySourceName: "测试",
          label: "电话",
          carryTerm: "测试",
          label: "提交时间",
          renovateTypeName: "测试",

          label: "状态",
          projectStateName: "测试",

          label: "受理单位",
          contacts: "测试",
          label: "是否可见",
          restoreContent: "测试",

          label: "评论区",
          workPlan: "测试"
        }
      ],
      // 分页器内容
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0
      },
      buttonItems: {
        options: [
          {
            text: "详情",
            cb: "verify",
            icon: "el-icon-view"
          },
          {
            text: "删除",
            cb: "delect",
            icon: "el-icon-delete",
            className: "isRed"
          }
        ],
        label: "操作",
        width: "200px"
      },
      activeName: "first",
      dialogVisible: false,
      dialogTitle: "项目详情",
      projectId: "",
      projectObj: {},
      projectName: "",
      acceptanceRules: {},
      baseForm: {},
      baseList: [
        {
          label: "项目名称 ",
          prop: "projectName",
          type: "input"
        },
        {
          label: "子项目名称",
          prop: "projectSubName",
          type: "input"
        },
        {
          label: "所属地市",
          prop: "area",
          type: "addressCascader",
          propsConfig: {
            checkStrictly: true
          },
          optionsList: []
        },
        {
          label: "修复类型 ",
          prop: "renovateType",
          type: "addressCascader",
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: [],
          onlyLast: false,
          collapseTags: true
        },
        {
          label: "资金来源 ",
          prop: "moneySource",
          type: "addressCascader",
          propsConfig: {
            checkStrictly: true
          },
          optionsList: []
        },
        {
          label: "下达资金(万元) ",
          prop: "issuedMoeny",
          type: "input"
        },
        {
          label: "项目状态 ",
          prop: "projectState",
          type: "addressCascader",
          propsConfig: {
            checkStrictly: true
          },
          optionsList: []
        },
        {
          label: "项目位置 ",
          prop: "projectPlace",
          type: "input",
          optionsList: []
        },
        {
          label: "申报年份 ",
          prop: "declareYear",
          type: "datePicker",
          dateType: "year",
          fromat: "yyyy",
          valueFromat: "yyyy"
        },
        {
          label: "承接单位 ",
          prop: "assumeUnit",
          type: "input"
        },
        {
          label: "经纬度 ",
          prop: "coordinate",
          type: "input"
        },
        {
          label: "实施年限 ",
          prop: "carryTerm",
          type: "input",
          optionsList: []
        },
        {
          label: "联系人 ",
          prop: "contacts",
          type: "input"
        },
        {
          label: "责任单位 ",
          prop: "accountabilityUnit",
          type: "input"
        },
        {
          label: "开始时间 ",
          prop: "startDate",
          type: "datePicker",
          dateType: "date",
          fromat: "yyyy-MM-dd HH:mm:ss",
          valueFromat: "yyyy-MM-dd HH:mm:ss"
        },
        {
          label: "验收时间 ",
          prop: "acceptDate",
          type: "datePicker",
          dateType: "date",
          fromat: "yyyy-MM-dd ",
          valueFromat: "yyyy-MM-dd"
        },
        {
          label: "资金支出进度 ",
          prop: "moneyExpPlan",
          type: "input"
        },
        {
          prop: "isTypical",
          type: "radio",
          label: "是否典型案例：",
          optionsList: []
        },
        {
          label: "项目完成进度 ",
          prop: "workPlan",
          type: "textarea",
          itemWidth: "1045px"
        },
        {
          label: "绩效目标 ",
          prop: "perfTarget",
          type: "textarea",
          itemWidth: "1045px"
        },
        {
          label: "修复内容 ",
          prop: "restoreContent",
          type: "textarea",
          itemWidth: "1045px"
        }
        // {
        //   label: "修复成效 ",
        //   prop: "restoreResult",
        //   type: "textarea",
        //   itemWidth: "1045px"
        // }
      ],
      btnItems: [
        {
          text: "保存",
          cb: "submitPreservation"
        },
        {
          text: "重置",
          cb: "submitReset"
        }
      ],
      selectionList: [],
      checkedHeader: [],
      isCheckedHeader: true,
      headerBtn: [
        // {
        //   label: "删除",
        //   cb: "delectitem",
        //   type: ""
        // },
        // {
        //   label: "上传",
        //   cb: "addExect",
        //   type: "save_btn"
        // },
        // {
        //   label: "新增",
        //   cb: "addItem",
        //   type: "save_btn"
        // },
        // {
        //   label: "导出",
        //   cb: "downloadExect",
        //   type: "save_btn"
        // }
      ],
      fileList: [],
      isLoding: false
    };
  },

  computed: {},
  mounted() {
    // this.init();
    // this.getCheckItem();
    // this.getRedis();
  },

  methods: {
    showTable() {},
    getCheckItem() {
      let list = [];
      this.tableItems.map(item => {
        list.push(item.label);
        return item;
      });
      this.checkedHeader = list;
    },
    changeTableHeader(val) {
      let list = val;
      let restList = [];
      restList = this.tableItems.map(item => {
        item.isShow = false;
        list.map(obj => {
          if (item.label === obj) {
            item.isShow = true;
            return obj;
          }
          // restList.push(item)
        });
        return item;
      });
      this.tableItems = restList;
      this.getDataList();
    },
    submitSearch(val) {
      this.query = val;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },
    toReset(val) {
      this.query = val;
      this.pagesData.pageNum = 1;
      this.pagesData.pageSize = 10;
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },
    delect(val) {
      this.$confirm("此操作将删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let params = {
            ids: val.projectId
          };
          let rest = await removeProject(params);
          this.$message.success("删除成功!");
          setTimeout(() => {
            this.getDataList();
          }, 200);
        })
        .catch(() => {
          this.$message.info("已取消删除!");
          setTimeout(() => {
            this.getDataList();
          }, 200);
        });
    },
    searchValMapType(val, resArray) {
      val.map(item => {
        if (item.length > 1 && Array.isArray(val[0])) {
          resArray.push(JSON.parse(JSON.stringify(item[1])));
        } else {
          resArray.push(item);
        }
      });
    },
    searchValMap(val, resArray) {
      val.map(item => {
        if (item.length > 1) {
          resArray.push(JSON.parse(JSON.stringify(item)).join("-"));
        } else {
          resArray.push(JSON.parse(JSON.stringify(item)).join(","));
        }
      });
    },
    saveValMap(val, resArray) {
      val.map(item => {
        if (item.length > 1 && Array.isArray(val[0])) {
          resArray.push(JSON.parse(JSON.stringify(item)).join(","));
        } else {
          resArray.push(item);
        }
      });
    },
    selectsValMap(val, resArray) {
      val.map(item => {
        resArray.push(JSON.parse(JSON.stringify(item))[0]);
      });
    },
    async getDataList() {
      this.isLoading = true;
      this.tableData = [];
      this.pagesData.total = 0;
      let params = {
        ...this.query,
        pageNum: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        sortField: "input_time",
        sortOrder: "desc"
      };
      if (params.area) {
        // params.areaCity = this.query.area[0];
        // if (this.query.area.length === 2) {
        //   params.areaCounty = this.query.area[1];
        // }

        var resCityArray = [];
        var resCountyArray = [];
        // this.searchValMap(params.area, resArray);
        params.area.map(item => {
          if (item.length > 1) {
            resCountyArray.push(JSON.parse(JSON.stringify(item[1])));
          } else {
            resCityArray.push(JSON.parse(JSON.stringify(item[0])));
          }
        });
        params.areaCity = resCityArray.join("-");
        params.areaCounty = resCountyArray.join("-");
      }
      if (params.projectState.length !== 0) {
        var projectStateArray = [];
        this.searchValMap(params.projectState, projectStateArray);
        params.projectState = projectStateArray.join(",");
      }
      // if (params.renovateType.length !== 0) {
      //   var renovateTypeArray = [];
      //   this.searchValMap(params.renovateType, renovateTypeArray);
      //   params.renovateType = renovateTypeArray.join(",");
      // }
      if (params.renovateType !== 0) {
        var renovateTypeArray = [];
        if (params.renovateType.length > 0) {
          this.searchValMapType(params.renovateType, renovateTypeArray);
          params.renovateType = renovateTypeArray.join(",");
        }
      }
      if (params.moneySource.length !== 0) {
        var moneySourceArray = [];
        this.searchValMap(params.moneySource, moneySourceArray);
        params.moneySource = moneySourceArray.join(",");
      }
      if (params.declareYear.length !== 0) {
        var declareYearSourceArray = [];
        this.selectsValMap(params.declareYear, declareYearSourceArray);
        params.declareYear = declareYearSourceArray.join(",");
      }
      let listJbxxaa = await ecologicalRenovateBasicInfoList(params);
      if (listJbxxaa.code === 200) {
        let data = listJbxxaa.data;
        this.tableData = data.rows;

        this.pagesData.total = data.total;
        this.pagesData.proCount = data.proCount;
        this.pagesData.pageNum = data.pageNum;
      }
      // this.getRedis()
      this.isLoading = false;
    },
    addExect() {
      this.dialogTitle = "数据导入";
      this.dialogVisible = true;
    },
    async downloadMb() {
      let rest = await ecolImportTemplate();
    },
    deletItem(val) {
      this.$confirm("此操作将删除该附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.fileList = this.fileList.filter(item => item.uid !== val.uid);
          this.$message.success("删除成功!");
        })
        .catch(() => {
          console.log("取消");
        });
    },
    previewFile(val) {},
    async toSaveExect() {
      const formData = new FormData();
      if (this.fileList.length > 0) {
        formData.append("file", this.fileList[0].raw);
        formData.append("username", this.fileList[0].name);
        let rest = await ecolImportInfo(formData);
        if (rest) {
          this.$message.success("导入数据成功!");
        }
      }
      this.handleClose();
    },
    async onFilesChange(file, filelist) {
      this.fileList.push(file);
      this.$message.success("上传附件成功!");
    },
    async downloadExect() {
      let parms = {
        ...this.query
      };
      let rest = await projectExport(parms);
    },
    addItem() {
      this.dialogTitle = "新增项目";
      this.dialogVisible = true;
    },
    async delectitem() {
      let list = [];
      this.selectionList.map(item => {
        list.push(item.projectId);
      });
      if (list.length === 0) {
        this.$message.error("选中的项目不能为空!");
        return false;
      }
      this.$confirm("此操作将删除选中的项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let params = {
            ids: list.join(",")
          };
          let rest = await removeProject(params);
          this.$message.success("删除成功!");
          setTimeout(() => {
            this.getDataList();
          }, 200);
        })
        .catch(() => {
          this.$message.info("已取消删除!");
          setTimeout(() => {
            this.getDataList();
          }, 200);
        });
    },
    // 按钮操作
    handleClick(val) {
      this[val.cb](val.row);
    },
    // 头部按钮
    haederBtnClick(val) {
      this[val.cb]();
    },
    // 查看详情
    verify(val) {
      this.dialogTitle = "项目详情";
      this.projectId = val.projectId;
      this.projectObj = val;
      this.isFullscreen = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.isFullscreen = false;
      this.projectObj = {};
      this.projectId = "";
      this.baseForm = {};
      setTimeout(() => {
        this.getDataList();
      }, 200);
    },
    handleSelectionChange(val) {
      this.selectionList = [];
      this.selectionList = val;
    },
    // 每页显示条目个数
    sizeChange(val) {
      this.pagesData.pageSize = val;
      this.getDataList();
    },
    // 当前页数
    currentChange(val) {
      this.pagesData.pageNum = val;
      this.getDataList();
    },
    handleSizeChange(val) {
      this.pagesData.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.pagesData.pageNum = val;
      this.getDataList();
    },
    async submitPreservation(val) {
      let params = {
        ...val
      };
      if (params.area) {
        params.areaCity = params.area[0];
        if (params.area.length === 2) {
          params.areaCounty = params.area[1];
        }
        params.area = params.area.join(",");
      }
      if (params.projectState) {
        params.projectState = params.projectState.join(",");
      }
      // if (params.renovateType) {
      //   params.renovateType = params.renovateType.join(",");
      // }
      if (params.renovateType) {
        var renovateTypeArray = [];
        this.saveValMap(params.renovateType, renovateTypeArray);
        params.renovateType = renovateTypeArray.join("-");
      }
      if (params.moneySource) {
        params.moneySource = params.moneySource.join(",");
      }
      let rest = await saveProject(params);
      if (rest.data.code === 200) {
        this.$message.success("新增项目成功!");
        this.handleClose();
      } else {
        this.$message.error("新增项目失败!");
        // this.handleClose();
      }
    },
    submitDelect(val) {
      this.$confirm("此操作将删除基本, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let params = {
            ids: val.projectId
          };
          let rest = await removeProject(params);
          this.$message.success("删除成功!");
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    submitReset(val) {}
  }
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
    margin: 20px 24px;
    padding: 32px 20px 10px 20px;
    box-shadow: 0px 2px 6px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    background: #ffffff;
  }
  .footer-table {
    margin: 20px;
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
