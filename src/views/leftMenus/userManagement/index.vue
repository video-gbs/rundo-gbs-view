<template>
  <div class="router_container4 m20">
    <div class="p10 bg-w user-panel-action-box">
      <div class="f1 f ai-c jc-e fw-w">
        <div class="fs14 mr10">用户名</div>
        <el-input
          v-model="search.username"
          class="mr10"
          size="mini"
          placeholder="请输入用户名"
        />
        <div class="fs14 mr10">手机号</div>
        <el-input
          v-model="search.mobile"
          class="mr10"
          size="mini"
          placeholder="请输入手机号"
        />
        <div class="fs14 mr10">创建时间</div>
        <el-date-picker
          v-model="search.createTime"
          style="width: 250px"
          class="mr10"
          size="mini"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <div class="fs14 mr10">最近登陆</div>
        <el-date-picker
          v-model="search.loginTime"
          class="mr10"
          size="mini"
          style="width: 250px"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button size="mini" type="primary" @click="searchBtn"
          >查询</el-button
        >
        <el-button size="mini" @click="resetBtn">重置</el-button>
      </div>
    </div>
    <div class="mt10 panel-header-box f jc-sb ai-c fw-w bg-w">
      <div class="title-css">用户管理</div>
    </div>
    <div class="bg-w p10">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column>
          <template slot="header">
            <div class="f ai-c jc-sb">
              <div>数据列表</div>
              <div>
                <el-button
                  v-if="selectList.length"
                  class="mr10"
                  size="mini"
                  type="primary"
                  @click="deleteItems('all')"
                  >批量删除</el-button
                >
                <el-button size="mini" type="primary" @click="dialogShow(1)"
                  >新增</el-button
                >
              </div>
            </div>
          </template>
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{ sex_[scope.row.sex + ""] }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="state" label="帐号状态">
            <template slot-scope="scope">
              {{ status[scope.row.status + ""] }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column
            prop="lastLoginTime"
            label="最近登录时间"
            width="160"
          />
          <el-table-column prop="lastLoginIp" label="最近登录IP" width="160" />
          <!-- <el-table-column prop="belongingPlace" label="IP归属地" width="160" /> -->
          <el-table-column width="100" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogShow(0, scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteItems(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="search"
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
          ref="formRef"
          class="params-form"
          size="mini"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          :rules="rules"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="dialog.params.username" placeholder="6~20字符" />
          </el-form-item>
          <el-form-item v-if="act" label="密码" prop="password">
            <div class="f fd-c mr30">
              <el-input
                v-model="dialog.params.password"
                placeholder="6~20字符"
                @input="checkPassworLevel"
              />
              <span class="fs12 mt10"
                >请使用大写字母（A~Z）、小写字母（a~z）、数字（0~9）三种组合</span
              >
            </div>
          </el-form-item>
          <el-form-item v-if="act" label="密码强度">
            <div class="password-level-box f ai-c">
              <div class="password-level f ai-c">
                <div
                  :style="{
                    'background-color':
                      passwordLevel > 0 ? 'rgba(30, 86, 160, 0.4)' : '',
                  }"
                />
                <div
                  :style="{
                    'background-color':
                      passwordLevel > 1 ? 'rgba(30, 86, 160, 0.8)' : '',
                  }"
                />
                <div
                  :style="{
                    'background-color':
                      passwordLevel > 2 ? 'rgba(30, 86, 160, 1)' : '',
                  }"
                />

                <span
                  v-if="passwordLevel === 1"
                  class="fs12 ml5"
                  style="color: rgba(30, 86, 160, 0.4)"
                >
                  弱
                </span>
                <span
                  v-if="passwordLevel === 2"
                  class="fs12 ml5"
                  style="color: rgba(30, 86, 160, 0.8)"
                >
                  中
                </span>
                <span
                  v-if="passwordLevel === 3"
                  class="fs12 ml5"
                  style="color: rgba(30, 86, 160, 1)"
                >
                  强
                </span>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="act" label="确认密码" prop="verifyPassword">
            <div class="f fd-c mr30">
              <el-input
                v-model="dialog.params.verifyPassword"
                placeholder="6~20字符"
              />
            </div>
          </el-form-item>
          <el-form-item label="账号状态">
            <el-radio v-model="dialog.params.status" :label="1">启用</el-radio>
            <el-radio v-model="dialog.params.status" :label="0">禁用</el-radio>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input
              v-model="dialog.params.nickName"
              placeholder="最多40个字符"
            />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="dialog.params.sex" placeholder="请选择性别">
              <el-option
                v-for="i in sex"
                :key="i.id"
                :label="i.label"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dialog.params.mobile" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dialog.params.email" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
import {
  getMemberList,
  addMember,
  editMember,
  deleteMember,
} from "@/api/method/member";
import { mobileReg, emailReg } from "@/utils/validate";

export default {
  name: "",
  components: { pagination },
  data() {
    return {
      search: {
        avatar: "",
        email: "",
        endTime: "",
        id: "",
        id_num: "",
        mobile: "",
        pageNum: 1,
        pageSize: 10,
        password: "",
        remarks: "",
        sex: "",
        startTime: "",
        status: "",
        true_name: "",
        user_code: "",
        username: "",
        createTime: [],
        loginTime: [],
        total: 0,
      },
      searchCopy: {},
      act: 0, // 0 编辑 1新增
      tableData: [],
      paramCopy: {},
      selectList: [],
      dialog: {
        show: false,
        title: "新增用户",
        params: {
          email: "",
          mobile: "",
          nickName: "",
          password: "",
          sex: 0,
          status: 1,
          username: "",
          verifyPassword: "",
        },
      },
      sex: [
        { id: 0, label: "保密" },
        { id: 1, label: "男" },
        { id: 2, label: "女" },
      ],
      sex_: {
        0: "保密",
        1: "男",
        2: "女",
      },
      state: [
        { id: 1, label: "启用" },
        { id: 0, label: "禁用" },
      ],
      status: {
        1: "启用",
        0: "禁用",
      },
      passwordLevel: 0,
      rules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名称" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入密码" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        verifyPassword: [
          { required: true, trigger: "blur", message: "请输入确认密码" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        nickName: [
          { required: true, trigger: "blur", message: "请输入昵称" },
          {
            min: 3,
            max: 40,
            message: "长度在 3 到 40 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, trigger: "blur", message: "请输入手机号" },

          { validator: mobileReg, trigger: "blur" },
        ],
        email: [
          { required: true, trigger: "blur", message: "请输入邮箱" },
          { validator: emailReg, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.searchCopy = Object.assign({}, this.search);
    this.paramCopy = Object.assign({}, this.dialog.params);
  },
  mounted() {
    this.checkPassworLevel();
    this.getList();
  },
  methods: {
    getList() {
      getMemberList(this.search).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data?.records;
          this.search.total = res.data.total;
        }
      });
    },
    searchBtn() {
      if (this.search.createTime.length) {
        this.search.startTime = this.search.createTime[0];
        this.search.endTime = this.search.createTime[1];
      }

      this.getList();
    },
    resetBtn() {
      this.search = Object.assign({}, this.searchCopy);
      this.getList();
    },
    sizeChange(v) {
      console.log("v");
      this.search.pageSize = v;
      this.getList();
      // 执行搜索
    },
    currentChange(v) {
      console.log("v2");
      // 执行搜索
      this.search.pageNum = v;
      this.getList();
    },
    goPage(path, query) {
      this.$router.push(path);
    },
    dialogShow(act, data) {
      this.act = act;
      this.dialog.title = act ? "新增用户" : `编辑用户 - ${data.username}`;
      if (act) {
        this.dialog.params = this.paramCopy;
      } else {
        Object.keys(data).forEach((i) => {
          this.dialog.params[i] !== undefined &&
            (this.dialog.params[i] = data[i]);
        });
        this.dialog.params.id = data.id;

        delete this.dialog.params.password;
        delete this.dialog.params.verifyPassword;
      }
      this.dialog.show = !this.dialog.show;
    },
    submitFn() {
      this.$refs["formRef"].validate((v) => {
        if (v) {
          const fn = this.act
            ? addMember(this.dialog.params)
            : editMember(this.dialog.params);
          fn.then((res) => {
            if (res.code === 10000) {
              this.$message.success(`${this.act ? "新增" : "编辑"}成功。`);
              this.dialog.show = false;
              this.getList();
              return;
            }
            this.$message.warning(res.message);
          }).catch((err) => {
            this.$message.warning("错误：" + JSON.stringify(err));
          });
        }
      });
    },
    deleteItems(v, data) {
      let ids = [];
      let title = "";
      if (v === "all") {
        ids = this.selectList.map((i) => {
          return i.id;
        });
        title = this.selectList
          .map((i) => {
            return i.username;
          })
          .join(",");
      } else {
        ids = [v.id];
        title = v.username;
      }

      this.$alert(`确定要删除 '${title}' 吗?`, "删除操作", {
        dangerouslyUseHTMLString: true,
        showCancelButton: true,
      }).then((action) => {
        deleteMember({ ids: ids })
          .then((res) => {
            if (res.code === 10000) {
              this.$message.success(`删除成功`);
              this.getList();
              return;
            }
            this.$message.warning(res.message);
          })
          .catch((err) => {
            this.$message.warning("错误：" + JSON.stringify(err));
          });
      });
    },
    handleSelectionChange(v) {
      console.log("v", v);
      this.selectList = v;
    },
    handleClose(done) {
      done();
    },
    checkPassworLevel() {
      const reg = /[A-Z]/;
      const reg2 = /[a-z]/;
      const reg3 = /[0-9]/;
      this.passwordLevel = 0;
      reg.test(this.dialog.params.password) && (this.passwordLevel += 1);
      reg2.test(this.dialog.params.password) && (this.passwordLevel += 1);
      reg3.test(this.dialog.params.password) && (this.passwordLevel += 1);

      const l = this.dialog.params.password.length;
      if (l < 5 || l > 20) {
        this.passwordLevel = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__body {
  padding: 30px 108px;
}
.el-input {
  width: 120px;
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
</style>
