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
      />
    </div>
    <div class="p20 mt20 bg-w">
      <el-table
        border
        :data="tableData"
        max-height="500"
        :header-cell-style="{ background: '#EAEAEA' }"
        style="width: 100%"
      >
        <el-table-column prop="label" label="编号" />
        <el-table-column prop="title" label="标题" width="180px" />
        <el-table-column prop="type" label="分类">
          <template slot-scope="scope">
            {{ $dict.type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="domain" label="领域">
          <template slot-scope="scope">
            {{ $dict.domain[scope.row.domain] }}
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="留言对象" />
        <el-table-column prop="state" label="发布账号" />
        <el-table-column prop="tel" width="120" label="电话" />
        <el-table-column prop="createTime" width="150" label="提交时间" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ $dict.status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="isShow" label="是否可见">
          <template slot-scope="scope">
            {{ $dict.isShow[scope.row.isShow] }}
          </template>
        </el-table-column>
        <el-table-column prop="operateDeptName" label="申请单位" />
        <el-table-column width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="dialogShow(scope.row)"
              >审核</el-button
            >
            <el-button type="text" @click="goDetail(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog title="审核登记" :visible.sync="auditPopData.show" width="30%">
      <PControlGroup
        v-if="auditPopData.show"
        :data="auditPopData.controlData"
        @onBtnClick="comfirmAudit"
        @onBtnCancel="comfirmAuditCancel"
      />
    </el-dialog>
  </div>
</template>

<script>
import PControlGroup from "@/components/PControlGroup";
import pagination from "@/components/Pagination/index.vue";
import {
  getAffairsassistList,
  assistDeptList,
  inviteReplyAudit,
} from "@/api/method/affairsassist";
import { unitList } from "@/api/method/unitManagement";

export default {
  components: {
    PControlGroup,
    pagination,
  },
  data() {
    return {
      queryControlData: null,
      params: {
        deptId: "", // 留言对象
        deptType: "",
        operateDeptId: "",
        domain: "", // 领域
        endTime: "", // 结束时间
        pageNum: 1,
        pageSize: 10,
        phone: "", // 电话
        pubUsername: "", // 发布账号
        startTime: "", // 开始
        status: "", // 状态
        title: "", // 标题
        type: "", // 分类
      },
      checkParams: {
        // result: 1,
        // content: '',
        // affairsId: '',
        // deptId: '',
        affairsId: "",
      },
      tableData: [],
      auditPopData: {
        show: false,
        controlData: null,
      },
      deptList: [],
      transferDeptList: [],
    };
  },
  created() {
    this.initQueryControl();
    this.getDeptFn();
    this.queryData();
  },
  methods: {
    initQueryControl() {
      this.queryControlData = {
        controls: [
          {
            label: "标题",
            type: "input",
            key: "title",
            span: 6,
            value: "",
          },
          {
            label: "分类",
            type: "select",
            key: "type",
            span: 6,
            value: "",
            options: this.$dict._type.filter((i) => {
              return i.value !== "";
            }),
          },
          {
            label: "领域",
            type: "select",
            key: "domain",
            span: 6,
            value: "",
            options: this.$dict._domain.filter((i) => {
              return i.value !== "";
            }),
          },
          {
            label: "留言对象",
            type: "select",
            key: "deptId",
            span: 6,
            value: "",
            options: this.deptList,
          },
          {
            label: "申请单位",
            type: "select",
            key: "processingDeptId",
            span: 6,
            value: "",
            options: this.deptList,
          },
          {
            label: "发布账号",
            type: "input",
            key: "pubUsername",
            span: 6,
            value: "",
          },
          {
            label: "电话",
            type: "input",
            key: "phone",
            span: 6,
            value: "",
          },
          {
            label: "提交时间",
            type: "date",
            dateType: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            key: "startTime",
            span: 6,
            value: "",
          },
        ],
        layoutConfig: {
          contentSpan: 20,
          buttonSpan: 4,
          showColon: false,
        },
      };
    },
    queryData(data) {
      let p = {};
      if (data && data.formData) {
        p = data.formData;
        console.log("data111111111111111111111", data);

        Object.keys(p).forEach((i) => {
          if (i !== "startTime") {
            this.params[i] !== undefined && (this.params[i] = p[i]);
          } else {
            if (p[i] && p[i].length) {
              this.params.startTime = p[i][0];
              this.params.endTime = p[i][1];
            } else {
              this.params.startTime = "";
              this.params.endTime = "";
            }
          }
        });
      }

      getAffairsassistList(this.params).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data.rows;
          this.params.total = res.data.total;
        }
      });
    },
    sizeChange() {},
    currentChange() {},
    goDetail(data) {
      this.$router.push(`/politicalList/reply/${data.auditId}`);
    },
    dialogShow(data) {
      this.checkParams.affairsId = data.id;
      this.checkParams.auditId = data.auditId;
      console.log("datadatadata", data);
      this.auditPopData.controlData = {
        layout: "vertical",
        controls: [
          {
            label: "审核结果",
            type: "radio",
            key: "auditResult",
            isRequired: true,
            value: "1",
            options: [
              { label: "同意", value: "1" },
              { label: "驳回", value: "0" },
            ],
          },
          {
            label: "协助单位",
            type: "transfer",
            key: "targetDepts",
            isRequired: true,
            btnText: "选择单位",
            value: [],
            rightDefaultChecked: [],
            titles: ["不可邀请单位", "可邀请单位"],
            options: [],
          },
          {
            label: "审核说明",
            type: "textarea",
            key: "content",
            autosize: { minRows: 3, maxRows: 5 },
            maxlength: 1000,
            value: "",
          },
        ],
      };

      // 获取受邀单位
      assistDeptList({ auditId: data.auditId }).then((res) => {
        if (res.code === 10000) {
          const ids = res.data.affairsAudit.targetDeptId.split(",");
          const names = res.data.affairsAudit.targetDeptName.split(",");
          ids.forEach((i, idx) => {
            this.transferDeptList.push({ label: names[idx], key: i });
            this.auditPopData.controlData.controls[1].options.push({
              label: names[idx],
              key: i,
            });
            this.auditPopData.controlData.updateControls([
              {
                key: "targetDepts",
                value: this.transferDeptList.map((i) => {
                  return i.key;
                }),
              },
            ]);
            // this.auditPopData.controlData.controls[1].value = this.transferDeptList.map(i => { return i.key })
            this.auditPopData.controlData.controls[1].rightDefaultChecked =
              this.transferDeptList.map((i) => {
                return i.key;
              });
          });
        }
      });

      this.auditPopData.show = true;
    },
    // mock() {
    //   this.auditPopData.controlData.updateControls([
    //     {
    //       key: 'f2',
    //       value: ['1', '2']
    //     }
    //   ])
    // },
    async comfirmAudit() {
      const isPass = await this.auditPopData.controlData.regCheck();
      if (!isPass) {
        return;
      }

      const data = this.auditPopData.controlData.getData();
      console.log(data);
      const arr = JSON.parse(JSON.stringify(data.targetDepts));
      data.targetDepts = [];
      this.transferDeptList.forEach((i) => {
        if (arr.indexOf(i.key) > -1) {
          data.targetDepts.push({ deptId: i.key, deptName: i.label });
        }
      });
      console.log(data);
      const p = Object.assign(this.checkParams, data);
      p.targetDeptIds = p.targetDepts
        .map((i) => {
          return i.deptId;
        })
        .join(",");
      p.targetDeptNames = p.targetDepts
        .map((i) => {
          return i.deptName;
        })
        .join(",");
      delete p.targetDepts;
      inviteReplyAudit(p);
      this.auditPopData.show = false;
    },
    comfirmAuditCancel() {
      this.auditPopData.controlData.updateControls([
        {
          key: "targetDepts",
          value: [],
        },
      ]);
      this.auditPopData.show = false;
    },
    getDeptFn() {
      // 获取部门列表
      unitList({ current: 1, size: 9999 }).then((res) => {
        if (res.code === 10000) {
          this.deptList = res.data.records.map((i) => {
            return { value: i.id, label: i.name };
          });
          // const arr = res.data.records.map(i => {
          //   return { value: i.id, label: i.name }
          // })
          this.queryControlData.controls[3].options = this.deptList;
          this.queryControlData.controls[4].options = this.deptList;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.router_container2 {
  .border-bottom {
    border-bottom: 1px solid #ececec;
  }
}
</style>
