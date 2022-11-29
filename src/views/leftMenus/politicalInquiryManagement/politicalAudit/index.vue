<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box">
      <div class="title-css">问政转移审核列表</div>
    </div>
    <div class="p20 border-bottom">
      <PControlGroup
        v-if="queryControlData"
        :data="queryControlData"
        @onBtnClick="queryData"
      ></PControlGroup>
    </div>
    <div class="p10 mt10">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column>
          <template slot="header">
            <div class="f ai-c jc-sb">
              <div>数据列表</div>
              <el-button size="mini" type="primary" @click="dialogShow(1)"
                >新增</el-button
              >
            </div>
          </template>
          <el-table-column prop="label" label="编号" />
          <el-table-column prop="sort" label="标题" />
          <el-table-column prop="state" label="分类" />
          <el-table-column prop="state" label="领域" />
          <el-table-column prop="state" label="留言对象" />
          <el-table-column prop="state" label="发布账号" />
          <el-table-column prop="tel" label="电话" />
          <el-table-column prop="createTime" label="提交时间" />
          <el-table-column prop="createTime" label="状态" />
          <el-table-column prop="createTime" label="是否可见" >
            <template slot-scope="scope">
                {{scope.row.isAvavle ? '是':'否'  }}
            </template>
          </el-table-column>
          <el-table-column prop="state" label="申请单位" />
          <el-table-column width="200" label="操作" fixed="right" >
            <template slot-scope="scope">
              <el-button type="text" @click="dialogShow(0, scope.row)">转移审核</el-button>
              <el-button type="text">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange" @current-change="currentChange"/>
    </div>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" width="700px" :before-close="handleClose">
      <div>
        <el-form class="params-form" size="mini" label-position="left" label-width="80px" :model="dialog.params">
          <el-form-item label="审核结果" required>
             <el-radio-group v-model="dialog.params.auditRes">
              <el-radio label="同意"></el-radio>
              <el-radio label="驳回"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="受理单位" required>
            <el-select v-model="dialog.params.acceptUnit" placeholder="">
              <el-option label="梧州市教育局" value="0"></el-option>
              <el-option label="梧州市教育局2" value="1"></el-option>
            </el-select> 
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input type="textarea" v-model="dialog.params.auditDec" placeholder="最多可输入1000个字"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="dialog.show = false">确 定</el-button>
      </span>
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
      dialog: {
        show: false,
        title: '审核登记',
        params: {
          auditRes: 0,
          acceptUnit: "0",
          auditDec: " ",
        }
      },
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
        },
      };
    },
    queryData(data) {
      console.log(data);
    },
    sizeChange(){

    },
    currentChange(){

    },
    dialogShow(){
      this.dialog.title = '审核登记'
      this.dialog.show = true;
    },
    handleClose(done) {
      done()
    },
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
