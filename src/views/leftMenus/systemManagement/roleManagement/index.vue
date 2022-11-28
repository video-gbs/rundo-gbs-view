<template>
  <div class="router_container4 m20 bg-w">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div class="title-css">角色管理</div>
    </div>
    <div class="p10">
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
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="detail" label="角色说明" />
          <el-table-column width="200" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogShow(0, scope.row)"
                >权限设置
              </el-button>
              <el-button type="text" @click="dialogShow(0, scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteRole(scope.row)"
                ><span class="delete-button">删除</span></el-button
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
      width="400px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="roleForm"
          class="params-form"
          size="mini"
          :rules="rules"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          @keyup.enter="submit('roleForm')"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="dialog.params.name" clearable :maxlength="15" />
          </el-form-item>
          <el-form-item label="角色说明">
            <el-input
              v-model="dialog.params.detail"
              type="textarea"
              :rows="2"
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item label="角色状态">
            <el-row>
              <el-col>
                <el-radio v-model="dialog.params.status" :label="1"
                  >启用</el-radio
                >
                <el-radio v-model="dialog.params.status" :label="0"
                  >禁用</el-radio
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRoles,
  editRoles,
  deleteRoles,
  setDataAuth,
  setAppAuth,
  getRolesList,
} from "@/api/method/role";
import {
  accountList
} from "@/api/method/accountManage";
import pagination from "@/components/Pagination/index.vue";
export default {
  name: "",
  components: { pagination },
  data() {
    return {
      search: {
        userName: "",
        phone: "",
        time: "",
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      dialog: {
        show: false,
        title: "新增角色",
        params: {
          detail: "",
          name: "",
          status: 1,
        },
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 0,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      remove: deleteRoles,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    sizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.getList();
    },
    currentChange(proCount) {
      this.params.proCount = proCount;
      this.getList();
    },
    goPage(path, query) {
      this.$router.push(path);
    },
    dialogShow(act, data) {
      if (act === 0) {
        const { name, detail, status } = data;
        this.dialog.params.detail = detail;
        this.dialog.params.name = name;
        this.dialog.params.status = Number(status);
        this.editId = data.id;
      }
      this.dialog.title = act ? "添加角色" : "编辑角色";
      this.dialog.show = !this.dialog.show;
    },
    handleClose(done) {
      done();
    },
    getList() {
      getRolesList({
        current: this.params.pageNum,
        size: this.params.pageSize,
      }).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data.rows;
          this.params.total = res.data.total;
          this.params.pages = res.data.pages;
          this.params.current = res.data.current;
        }
      });
    },
    deleteRole(row) {
      this.$confirm("删除后数据无法恢复，是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteRoles(row.id).then((res) => {
          if (res.code === 10000) {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getAccountList();
          }
        });
      });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case "添加角色":
              addRoles(this.dialog.params).then((res) => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: "添加角色成功",
                  });
                  this.dialog.show = false;
                  this.getList();
                }
              });
              break;
            case "编辑角色":
              editRoles({ id: this.editId, ...this.dialog.params }).then(
                (res) => {
                  if (res.code === 10000) {
                    this.$message.success("编辑成功");
                    this.dialog.show = false;
                    this.getList();
                  }
                }
              );
              break;

            default:
              break;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 100%;
}

.params-form {
  .el-input,
  .el-select {
    width: 100%;
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
.delete-button {
  color: red !important;
}
</style>
