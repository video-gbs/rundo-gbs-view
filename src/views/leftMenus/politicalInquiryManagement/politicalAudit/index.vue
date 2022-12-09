<template>
  <div class="router_container2 m20">
    <div class="panel-header-box bg-w">
      <div class="title-css">问政转移审核列表</div>
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
        <el-table-column prop="title" label="标题" />
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
        <el-table-column prop="username" label="发布账号" />
        <el-table-column prop="phone" width="120" label="电话" />
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
              >转移审核</el-button
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

    <PDialog ref="checkRef" @submit="comfirmAudit">
      <template slot="title">转移审核</template>
      <template slot="main">
        <el-form label-position="left" label-width="80px" :model="checkParams">
          <el-form-item label="审核结果">
            <el-radio-group
              v-model="checkParams.auditResult"
              @input="radioChange"
            >
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="受理单位">
            <el-select
              v-model="checkParams.targetDeptId"
              :disabled="!checkParams.auditResult"
              placeholder="请选择受理单位"
            >
              <el-option
                v-for="i in deptList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="checkParams.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!-- <el-dialog
      title="转移审核"
      :visible.sync="checkShow"
      width="40%"
    >
      <div>
        <el-form label-position="left" label-width="80px" :model="checkParams">
          <el-form-item label="审核结果">
            <el-radio-group v-model="checkParams.auditResult" @input="radioChange">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">驳回</el-radio>
            </el-radio-group>

          </el-form-item>
          <el-form-item label="受理单位">
            <el-select v-model="checkParams.targetDeptId" :disabled="!checkParams.auditResult" placeholder="请选择受理单位">
              <el-option
                v-for="i in deptList"
                :key="i.value"
                :label="i.label"
                :value="i.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="checkParams.content" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkShow=false ">取 消</el-button>
        <el-button type="primary" @click="comfirmAudit">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- <el-dialog title="转移审核" :visible.sync="auditPopData.show" width="30%">
      <PControlGroup
        v-if="auditPopData.show"
        :data="auditPopData.controlData"
        @onBtnClick="comfirmAudit"
        @onBtnCancel="auditPopData.show = false"
      />
    </el-dialog> -->
  </div>
</template>

<script>
import PControlGroup from "@/components/PControlGroup";
import PDialog from "@/components/PDialog";
import pagination from "@/components/Pagination/index.vue";
import { unitList } from "@/api/method/unitManagement";
import { transferCheckList, transferCheckAo } from "@/api/method/transfer";
import { affairAudit } from "@/api/method/affairscheck";

export default {
  components: {
    PControlGroup,
    pagination,
    PDialog,
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
      checkShow: false,
      checkParams: {
        affairsId: "",
        auditResult: 1,
        content: "",
        targetDeptId: "",
        targetDeptName: "",
      },
      tableData: [],
      auditPopData: {
        show: false,
        data: null,
      },
      one: {},
      oneByDept: {},
      deptList: [],
    };
  },
  watch: {
    auditPopData: {
      handler: function (n) {
        console.log("单选框处理", n);
      },
      deep: true,
    },
  },
  created() {
    this.initQueryControl();
    // 获取部门
    this.getDeptFn();
    // 获取审核列表
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
            options: this.$dict._type,
          },
          {
            label: "领域",
            type: "select",
            key: "domain",
            span: 6,
            value: "",
            options: this.$dict._domain,
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
            console.log(" this.params[i]", this.params[i]);
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
      transferCheckList(this.params).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data.rows;
          this.params.total = res.data.total;
        }
      });
      console.log(data);
    },
    sizeChange() {},
    currentChange() {},
    async dialogShow(data) {
      this.one = data;
      this.checkParams.auditId = data.auditId;
      this.checkParams.affairsId = data.id;

      await affairAudit({ auditId: data.auditId }).then((res) => {
        if (res.code === 10000) {
          this.oneByDept = res.data;
          this.checkParams.targetDeptId = res.data.affairsAudit.targetDeptId;
          this.checkParams.targetDeptName =
            res.data.affairsAudit.targetDeptName;
        }
      });
      // this.checkShow = !this.checkShow
      this.$refs["checkRef"].visible = true;
    },
    radioChange() {
      if (this.checkParams.auditResult === 2) {
        // 重置转移对象为原对象
        // this.checkParams.targetDeptId = this.oneByDept
        this.checkParams.targetDeptId =
          this.oneByDept.affairsAudit.operateDeptId;
        this.checkParams.targetDeptName =
          this.oneByDept.affairsAudit.operateDeptName;
      } else {
        this.checkParams.targetDeptId =
          this.oneByDept.affairsAudit.targetDeptId;
        this.checkParams.targetDeptName =
          this.oneByDept.affairsAudit.targetDeptName;
      }
    },
    comfirmAudit(data) {
      // 审核问政转移
      this.checkParams.targetDeptName = this.deptList.filter((i) => {
        return i.id === this.checkParams.targetDeptId;
      })[0].name;
      console.log("this.checkParams", this.checkParams);
      // 执行 问政转移审核方法
      // fn...
      transferCheckAo(this.checkParams).then((res) => {
        if (res.code === 10000) {
          this.$message.success("审核成功");
          this.$refs["checkRef"].visible = false;
          this.queryData();
        }
      });
    },
    goDetail(data) {
      this.$router.push(`/politicalList/audit/${data.auditId}`);
    },
    getDeptFn() {
      // 获取部门列表
      unitList({ current: 1, size: 9999 }).then((res) => {
        if (res.code === 10000) {
          this.deptList = res.data.records.filter((i) => {
            return i.deptType > 1;
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
