<template>
  <div class="router_container2 m20">
    <div class="panel-header-box bg-w">
      <div class="title-css">邀请回复审核列表</div>
    </div>
    <div class="p20 border-bottom bg-w">
      <PControlGroup
        v-if="queryControlData"
        :data="queryControlData"
        @onBtnClick="queryData"
      ></PControlGroup>
    </div>
    <div class="p20 mt20 bg-w">
      <el-table border :data="tableData" max-height="500" :header-cell-style="{background: '#EAEAEA'}" style="width: 100%">
        <el-table-column prop="label" label="编号" />
        <el-table-column prop="sort" label="标题" />
        <el-table-column prop="state" label="分类" />
        <el-table-column prop="state" label="领域" />
        <el-table-column prop="state" label="留言对象" />
        <el-table-column prop="state" label="发布账号" />
        <el-table-column prop="tel" width="120" label="电话" />
        <el-table-column prop="createTime" width="150" label="提交时间" />
        <el-table-column prop="createTime" label="状态" />
        <el-table-column prop="createTime" label="是否可见" >
          <template slot-scope="scope">
              {{scope.row.isAvavle ? '是':'否'  }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="申请单位" />
        <el-table-column width="200" label="操作" fixed="right" >
          <template slot-scope="scope">
            <el-button type="text" @click="dialogShow(0, scope.row)">邀请审核</el-button>
            <el-button type="text">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange" @current-change="currentChange"/>
    </div>
    <el-dialog title="审核登记" :visible.sync="auditPopData.show" width="30%">
      <PControlGroup
        v-if="auditPopData.show"
        :data="auditPopData.controlData"
        @onBtnClick="comfirmAudit"
        @onBtnCancel="auditPopData.show = false"
      ></PControlGroup>
    </el-dialog>
  </div>
</template>

<script>
import PControlGroup from "@/components/PControlGroup";
import pagination from '@/components/Pagination/index.vue'

export default {
  data() {
    return {
      queryControlData: null,
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0
      },
      tableData: [
        { id: 1, label: 'afsdf', sort: 1, state: 1, tel: '19113250259', isAvavle: 0 ,createTime: '2022-11-11 15:25:14' }
      ],
      auditPopData: {
        show: false,
        controlData: null,
      }
    };
  },
  components: {
    PControlGroup,
    pagination
  },
  created() {
    this.initQueryControl();
  },
  methods: {
    initQueryControl() {
      this.queryControlData = {
        controls: [
          {
            label: "标题",
            type: "input",
            key: "f1",
            span: 6,
            value: "",
          },
          {
            label: "分类",
            type: "input",
            key: "f2",
            span: 6,
            value: "",
          },
          {
            label: "领域",
            type: "select",
            key: "f3",
            span: 6,
            value: "",
            options: [
              { label: "xxxx", value: "1" },
              { label: "xxxx", value: "2" },
            ],
          },
          {
            label: "留言对象",
            type: "select",
            key: "f4",
            span: 6,
            value: "",
            options: [
              { label: "xxxx", value: "1" },
              { label: "xxxx", value: "2" },
            ],
          },
          {
            label: "申请单位",
            type: "select",
            key: "f5",
            span: 6,
            value: "",
            options: [
              { label: "xxxx", value: "1" },
              { label: "xxxx", value: "2" },
            ],
          },
          {
            label: "发布账号",
            type: "input",
            key: "f6",
            span: 6,
            value: "",
          },
          {
            label: "电话",
            type: "input",
            key: "f7",
            span: 6,
            value: "",
          },
          {
            label: "提交时间",
            type: "date",
            dateType: "daterange",
            key: "f8",
            span: 6,
            value: "",
          },
        ],
        layoutConfig: {
          contentSpan: 20,
          buttonSpan: 4,
          showColon: false
        }
      };
    },
    queryData(data) {
      console.log(data);
    },
    sizeChange() {

    },
    currentChange() {

    },
    dialogShow() {
      this.auditPopData.controlData = {
        layout: 'vertical',
        controls: [
          {
            label: '审核结果',
            type: 'radio',
            key: 'f1',
            isRequired: true,
            value: '',
            options: [
              { label: '同意', value: '1' },
              { label: '驳回', value: '0' },
            ]
          },
          {
            label: "协助单位",
            type: "transfer",
            key: "f2",
            isRequired: true,
            btnText: '选择单位',
            value: [],
            options: [
              { label: "梧州教育局", key: "1" },
              { label: "钦州教育局", key: "2" },
              { label: "南宁教育局", key: "3" },
              { label: "百色教育局", key: "4" },
            ],
          },
          {
            label: '审核说明',
            type: 'textarea',
            key: 'f3',
            autosize: { minRows: 3, maxRows: 5},
            maxlength: 1000,
            value: '',
          }
        ]
      };

      this.auditPopData.show = true;
    },
    async comfirmAudit() {
      const isPass = await this.auditPopData.controlData.regCheck();
      if(!isPass) {
        return;
      }

      const data = this.auditPopData.controlData.getData();
      console.log(data);
      this.auditPopData.show = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.router_container2{
  .border-bottom{
    border-bottom: 1px solid #ECECEC;
  }
}
</style>
