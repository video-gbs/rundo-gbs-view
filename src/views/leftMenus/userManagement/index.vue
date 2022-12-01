<template>
  <div class="router_container4 m20 bg-w">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div class="title-css">用户管理</div>
      <div class="f1 f ai-c jc-e fw-w">
        <div class="fs14 mr10">用户名</div>
        <el-input
          v-model="search.userName"
          class="mr10"
          size="mini"
          placeholder="请输入用户名"
        />
        <div class="fs14 mr10">手机号</div>
        <el-input
          v-model="search.phone"
          class="mr10"
          size="mini"
          placeholder="请输入手机号"
        />
        <div class="fs14 mr10">最近登陆</div>
        <el-date-picker
          v-model="search.time"
          class="mr10"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button size="mini" type="primary">查询</el-button>
        <el-button size="mini">重置</el-button>
      </div>
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
          <el-table-column prop="label" label="用户名" />
          <el-table-column prop="sort" label="昵称" />
          <el-table-column prop="state" label="性别" />
          <el-table-column prop="state" label="手机号" />
          <el-table-column prop="state" label="邮箱" />
          <el-table-column prop="state" label="帐号状态" />
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column prop="createTime" label="最近登录时间" width="160" />
          <el-table-column prop="createTime" label="最近登录IP" width="160" />
          <el-table-column prop="createTime" label="IP归属地" width="160" />
          <el-table-column width="100" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogShow(0, scope.row)"
                >编辑</el-button
              >
              <el-button type="text">删除</el-button>
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
        >
          <el-form-item label="名称">
            <el-input v-model="dialog.params.name" placeholder="6~20字符" />
          </el-form-item>
          <el-form-item label="密码">
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
          <el-form-item label="密码强度">
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
          <el-form-item label="账号状态">
            <el-radio v-model="dialog.params.state" :label="1">启用</el-radio>
            <el-radio v-model="dialog.params.state" :label="0">禁用</el-radio>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input
              v-model="dialog.params.nickName"
              placeholder="最多40个字符"
            />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="dialog.params.gender" placeholder="请选择性别">
              <el-option
                v-for="i in gender"
                :key="i.id"
                :label="i.label"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="dialog.params.phone" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="dialog.params.email" />
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
        proCount: 0,
      },
      tableData: [
        {
          id: 1,
          label: "afsdf",
          sort: 1,
          state: 1,
          createTime: "2022-11-11 15:25:14",
        },
      ],
      dialog: {
        show: false,
        title: "新增用户",
        params: {
          name: "",
          gender: 1,
          state: 1,
          password: "aZ1",
          nickName: "",
          phone: "",
          email: "",
        },
      },
      gender: [
        { id: 1, label: "男" },
        { id: 2, label: "女" },
      ],
      state: [
        { id: 1, label: "启用" },
        { id: 0, label: "禁用" },
      ],
      passwordLevel: 0,
    };
  },
  mounted() {
    this.checkPassworLevel();
  },
  methods: {
    sizeChange(v) {
      console.log("v");
      // 执行搜索
    },
    currentChange(v) {
      console.log("v2");
      // 执行搜索
    },
    goPage(path, query) {
      this.$router.push(path);
    },
    dialogShow(act, data) {
      this.dialog.title = act ? "新增用户" : `编辑用户 - ${data.name}`;
      this.dialog.show = !this.dialog.show;
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
