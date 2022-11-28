<template>
  <div v-if="!this.showDetails" class="projectManagement">
    <div class="seach">
      <Seach
        :form-list="FormList"
        :query="pagesData"
        @submitSearch="submitSearch"
        @submitReset="toReset"
      />
    </div>
    <div class="footer-table">
      <div class="tab-table">
        <ComTabble
          :index="index"
          :page-size="pagesData.pageSize"
          :page-num="pagesData.pageNum"
          :selection="selection"
          :header-style="headerStyle"
          :is-loading="isLoading"
          :max-height="maxHeight"
          :left-title="leftTitle"
          :table-items="tableItems"
          :table-data="tableData"
          :button-items="buttonItems"
          :is-checked-header="isCheckedHeader"
          :header-btn="headerBtn"
          :checked-header.sync="checkedHeader"
          @haederBtnClick="haederBtnClick"
          @handleClick="handleClick"
          @changeTableHeader="changeTableHeader"
          @selection-change="handleSelectionChange"
        />
        <Pagination
          :pages-data="pagesData"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Seach from '@/components/Seach/index.vue'
import ComTabble from '@/components/ComTabble/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { unitList } from '@/api/method/unitManagement'
import {
  affairsInfoList,
  affairsInfoDelete,
  affairsInfoSearch
} from '@/api/method/politicalList'
export default {
  name: 'ProjectManagement',
  components: {
    Seach,
    ComTabble,
    Pagination
  },
  data() {
    return {
      showDetails: false,
      headerStyle: {
        background: '#EAEAEA',
        fontsize: '14px',
        fontWeight: 400,
        color: '#333333'
      },
      // 搜索栏配置

      FormList: [
        {
          poro: 'title',
          type: 'input',
          label: '标题：',
          size: 'small'
        },
        {
          poro: 'type',
          type: 'select',
          label: '分类：',
          size: 'small',
          optionsList: this.$dict._type
        },
        {
          poro: 'domain',
          type: 'select',
          label: '领域：',
          size: 'small',
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: this.$dict._domain
        },
        {
          poro: 'deptId',
          type: 'select',
          label: '留言对象：',
          size: 'small',
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        },

        {
          poro: 'isShow',
          type: 'select',
          label: '显示状态：',
          size: 'small',
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: this.$dict._isShow
        },
        {
          poro: 'pubUsername',
          label: '发布账号：',
          size: 'small',
          type: 'input',
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        },
        {
          poro: 'phone',
          type: 'input',
          label: '电话：',
          size: 'small',
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: []
        }
      ],
      // 搜索from
      query: {
        deptId: 0,
        deptType: 0,
        domain: '',
        endTime: '',
        field: [],
        fileBatchId: 0,
        isDeleted: 0,
        isReview: 0,
        isShow: 0,
        order: true,
        phone: '',
        pubUsername: '',
        realName: '',
        startTime: '',
        status: 0,
        title: '',
        type: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0
      },
      // 高级搜索
      isLoading: false,
      // 表单数据
      index: true,
      tableItems: [
        {
          label: '编号',
          name: 'projectName',
          width: '100',
          isShow: true,
          isBold: false
        },
        {
          label: '标题',
          name: 'title',
          width: '200',
          isShow: true
        },
        {
          label: '分类',
          name: 'type',
          content: 'type',
          isShow: true,
          width: '80'
        },
        {
          label: '留言对象',
          name: 'deptName',
          isShow: true
        },
        {
          label: '发布账号',
          name: 'account',
          isShow: true
        },
        {
          label: '电话',
          name: 'phone',
          isShow: true
        },
        {
          label: '提交时间',
          name: 'createTime',
          isShow: true,
          width: '120'
        },
        {
          label: '状态',
          name: 'status',
          isShow: true,
          content: 'status',
          width: '80'
        },
        {
          label: '受理单位',
          name: 'contacts',
          isShow: true
        },
        {
          label: '是否可见',
          name: 'isShow',
          isShow: true,
          content: 'isShow',
          width: '80'
        },
        {
          label: '评论区',
          name: 'isReview',
          isShow: true,
          content: 'isReview',
          width: '80'
        }
      ],
      maxHeight: 800,
      tableData: [],
      // 分页器内容
      pagesData: {
        'account': '',
        'deptId': '',
        'deptType': 0,
        'domain': '',
        'endTime': '',
        'field': [],
        'fileBatchId': 0,
        'isDeleted': 0,
        'isReview': 0,
        'isShow': 0,
        'order': true,
        'pageNum': 1,
        'pageSize': 10,
        'phone': '',
        'pubUsername': '',
        'realName': '',
        'startTime': '',
        'status': '',
        'title': '',
        'type': '',
        'total': 0,
        'proCount': 0
      },
      buttonItems: {
        options: [
          {
            text: '详情',
            cb: 'verify',
            icon: 'el-icon-view'
          },
          {
            text: '删除',
            cb: 'delect',
            icon: 'el-icon-delete',
            className: 'isRed'
          }
        ],
        label: '操作',
        width: '200px'
      },
      activeName: '',
      dialogVisible: false,
      dialogTitle: '项目详情',
      baseList: [
        {
          label: '项目名称 ',
          prop: 'projectName',
          type: 'input'
        },
        {
          label: '子项目名称',
          prop: 'projectSubName',
          type: 'input'
        },
        {
          label: '所属地市',
          prop: 'area',
          type: 'addressCascader',
          propsConfig: {
            checkStrictly: true
          },
          optionsList: []
        },
        {
          label: '修复类型 ',
          prop: 'renovateType',
          type: 'addressCascader',
          propsConfig: {
            checkStrictly: true,
            multiple: true
          },
          optionsList: [],
          onlyLast: false,
          collapseTags: true
        },
        {
          label: '资金来源 ',
          prop: 'moneySource',
          type: 'addressCascader',
          propsConfig: {
            checkStrictly: true
          },
          optionsList: []
        },
        {
          label: '下达资金(万元) ',
          prop: 'issuedMoeny',
          type: 'input'
        },
        {
          label: '项目状态 ',
          prop: 'projectState',
          type: 'addressCascader',
          propsConfig: {
            checkStrictly: true
          },
          optionsList: []
        },
        {
          label: '项目位置 ',
          prop: 'projectPlace',
          type: 'input',
          optionsList: []
        },
        {
          label: '申报年份 ',
          prop: 'declareYear',
          type: 'datePicker',
          dateType: 'year',
          fromat: 'yyyy',
          valueFromat: 'yyyy'
        },
        {
          label: '承接单位 ',
          prop: 'assumeUnit',
          type: 'input'
        },
        {
          label: '经纬度 ',
          prop: 'coordinate',
          type: 'input'
        },
        {
          label: '实施年限 ',
          prop: 'carryTerm',
          type: 'input',
          optionsList: []
        },
        {
          label: '联系人 ',
          prop: 'contacts',
          type: 'input'
        },
        {
          label: '责任单位 ',
          prop: 'accountabilityUnit',
          type: 'input'
        },
        {
          label: '开始时间 ',
          prop: 'startDate',
          type: 'datePicker',
          dateType: 'date',
          fromat: 'yyyy-MM-dd HH:mm:ss',
          valueFromat: 'yyyy-MM-dd HH:mm:ss'
        },
        {
          label: '验收时间 ',
          prop: 'acceptDate',
          type: 'datePicker',
          dateType: 'date',
          fromat: 'yyyy-MM-dd ',
          valueFromat: 'yyyy-MM-dd'
        },
        {
          label: '资金支出进度 ',
          prop: 'moneyExpPlan',
          type: 'input'
        },
        {
          prop: 'isTypical',
          type: 'radio',
          label: '是否典型案例：',
          optionsList: []
        },
        {
          label: '项目完成进度 ',
          prop: 'workPlan',
          type: 'textarea',
          itemWidth: '1045px'
        },
        {
          label: '绩效目标 ',
          prop: 'perfTarget',
          type: 'textarea',
          itemWidth: '1045px'
        },
        {
          label: '修复内容 ',
          prop: 'restoreContent',
          type: 'textarea',
          itemWidth: '1045px'
        }
      ],
      btnItems: [
        {
          text: '保存',
          cb: 'submitPreservation'
        },
        {
          text: '重置',
          cb: 'submitReset'
        }
      ],
      selectionList: [],
      checkedHeader: [],
      isCheckedHeader: true,
      headerBtn: [],
      fileList: [],
      isLoding: false
    }
  },

  computed: {},
  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getDataList()
      this.getDeptFn()
    },
    getDataList() {
      affairsInfoList(this.pagesData).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data ? res.data.rows : []
          this.pagesData.total = res.data.total
          this.pagesData.pages = res.data.pages
          this.pagesData.current = res.data.current
        }
      })
    },
    getDeptFn() {
      // 获取部门
      unitList({ 'current': 1, 'size': 3000 }).then(res => {
        if (res.code === 10000) {
          0
          this.FormList.forEach(i => {
            if (i.poro === 'deptId') {
              i.optionsList = res.data.records.map(l => {
                return { value: l.id, label: l.name }
              })
            }
          })
        }
      })
    },
    submitSearch() { this.getDataList() },
    toReset(val) {
      this.query = val
      this.pagesData.pageNum = 1
      this.pagesData.pageSize = 10
      setTimeout(() => {
        this.getDataList()
      }, 200)
    },

    deletItem(val) {
      this.$confirm('此操作将删除该附件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.fileList = this.fileList.filter((item) => item.uid !== val.uid)
          this.$message.success('删除成功!')
        })
        .catch(() => {
          console.log('取消')
        })
    },

    async downloadExect() {
      const parms = {
        ...this.query
      }
      const rest = await projectExport(parms)
    },

    async delectitem() {
      const list = []
      this.selectionList.map((item) => {
        list.push(item.projectId)
      })
      if (list.length === 0) {
        this.$message.error('选中的项目不能为空!')
        return false
      }
      this.$confirm('此操作将删除选中的项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const params = {
            ids: list.join(',')
          }
          const rest = await removeProject(params)
          this.$message.success('删除成功!')
          setTimeout(() => {
            this.getDataList()
          }, 200)
        })
        .catch(() => {
          this.$message.info('已取消删除!')
          setTimeout(() => {
            this.getDataList()
          }, 200)
        })
    },
    // 查看详情
    verify(val) {
      this.dialogTitle = '项目详情'
      this.projectId = val.projectId
      this.projectObj = val
      this.isFullscreen = true
    },
    // 每页显示条目个数
    sizeChange(val) {
      this.pagesData.pageSize = val
      this.getDataList()
    },
    // 当前页数
    currentChange(val) {
      this.pagesData.pageNum = val
      this.getDataList()
    },
    handleSizeChange(val) {
      this.pagesData.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.getDataList()
    }
  }
}
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
