<template>
  <div class="router_container4 m20 bg-w">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div class="title-css">单位管理</div>
    </div>
    <div class="p10">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column>
          <template slot="header">
            <div class="f ai-c jc-sb">
              <div>单位列表</div>
              <el-button size="mini" type="primary" @click="dialogShow(1)"
                >新增</el-button
              >
            </div>
          </template>
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column prop="label" label="单位名称" />
          <el-table-column prop="sort" label="账号数量" />
          <el-table-column width="100" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogShow(0, scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteUnit(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="700px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          class="params-form"
          size="mini"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          :rules="rules"
        >
          <el-form-item label="单位名称" prop="unitName">
            <el-input
              v-model="dialog.params.unitName"
              placeholder="最多可输入40个字符"
            />
          </el-form-item>
          <el-form-item label="单位分类" prop="unitType">
            <el-select v-model="dialog.params.unitType" placeholder="请选择分类">
              <el-option
                v-for="i in gender"
                :key="i.id"
                :label="i.label"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单位描述" prop="unitDescribe">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="最多可输入4000个字符"
              v-model="dialog.params.unitDescribe"
            >
            </el-input>
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
import pagination from "@/components/Pagination/index.vue";
import {
  unitAdd,
  unitEdit,
  unitList,
  unitDelete
} from "@/api/method/unitManagement";
import { Local } from "@/utils/storage";

export default {
  name: "",
  components: { pagination },
  data() {
    return {
      search: {
        userName: "",
        phone: "",
        time: ""
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0
      },
      tableData: [
        {
          id: 1,
          label: "afsdf",
          sort: 1,
          state: 1,
          createTime: "2022-11-11 15:25:14"
        }
      ],
      dialog: {
        show: false,
        title: "新增用户",
        params: {
          unitName: "",
          unitType: 1,
          unitDescribe: ""
        }
      },
      gender: [
        { id: 1, label: "男" },
        { id: 2, label: "女" }
      ],
      state: [
        { id: 1, label: "启用" },
        { id: 0, label: "禁用" }
      ],
      passwordLevel: 0,
      editId: "",
      headers: {
        Authorization: Local.getToken()
      },
      rules: {
        unitName: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            max: 40,
            message: "40个字符",
            trigger: "blur"
          }
        ],
        unitType: {
          required: true,
          message: "不能为空",
          trigger: "change"
        },
        unitDescribe: {
          required: true,
          message: "不能为空",
          trigger: "blur",
          max: 40
        }
      }
    };
  },
  mounted() {
    this.getUnitList();
  },
  methods: {
    sizeChange(v) {},
    currentChange(v) {},
    goPage(path, query) {
      this.$router.push(path);
    },
    dialogShow(act, data) {
      this.dialog.title = act ? "新增单位" : "编辑单位";
      this.dialog.show = !this.dialog.show;
      if (act === 0) {
        const { unitName, unitType, unitDescribe } = data;
        this.dialog.params.unitName = unitName;
        this.dialog.params.unitType = unitType;
        this.dialog.params.unitDescribe = unitDescribe;
        this.editId = data.id;
      }
    },

    getUnitList() {
      unitList(
        {
          ...this.params,
          current: this.params.pageNum,
          size: this.params.pageSize
        },
        this.headers
      ).then(res => {
        if (res.code === 10000) {
          this.tableData = res.data.records;
          this.params.total = res.data.total;
          this.params.pages = res.data.pages;
          this.params.current = res.data.current;
        }
      });
    },
    deleteUnit(row) {
      this.$confirm("删除后数据无法恢复，是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        unitDelete(row.id, this.headers).then(res => {
          if (res.code === 10000) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getUnitList();
          }
        });
      });
    },

    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.dialog.title) {
            case "新增单位":
              unitAdd(this.dialog.params, this.headers).then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: "单位新增成功"
                  });
                  this.dialog.show = false;
                  this.getAccountList();
                }
              });
              break;
            case "编辑单位":
              unitEdit(
                { id: this.editId, ...this.dialog.params },
                this.headers
              ).then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: "单位修改成功"
                  });
                  this.dialog.show = false;
                  this.getAccountList();
                }
              });
              break;

            default:
              break;
          }
        }
      });
    },
    handleClose(done) {
      done();
    }
  }
};
</script>

<style lang="scss" scoped>
.params-form {
  .el-input,
  .el-select {
    width: 240px;
    margin-right: 30px;
  }
}
.password-level-box {
  height: 28px !important;
  width: 100px;
  .password-level {
    height: 10px;
    width: 100px;

    > div {
      height: inherit;
      width: 33%;
      border: 1px solid #eee;
      margin-right: 5px;

      &:last-child {
        margin-right: 0px;
      }
    }
  }
}

::v-deep .el-form-item__content {
  // height: 28px;
  display: flex;
  align-items: center;
}
</style>
