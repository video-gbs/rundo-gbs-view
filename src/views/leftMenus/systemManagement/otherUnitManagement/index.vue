<template>
  <div class="router_container4 m20 bg-w">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div class="title-css">其他单位账号管理</div>
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
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="roleId" label="所属角色" />
          <el-table-column prop="status" label="帐号状态">
            <template slot-scope="scope">
              <span>{{
                scope.row.status === "1"
                  ? "启用"
                  : scope.row.status === "0"
                  ? "禁用"
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column width="200" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="editPassword(scope.row)"
                >修改密码</el-button
              >
              <el-button type="text" @click="dialogShow(0, scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteAccount(scope.row)"
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
      width="700px"
      :before-close="handleClose"
      v-if="editShow"
    >
      <div>
        <el-form
          class="params-form"
          size="mini"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          :rules="rules"
          ref="accountForm"
          @keyup.enter="submit('accountForm')"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号" prop="account">
                <el-input
                  v-model="dialog.params.account"
                  placeholder="6~20字符"
                />
              </el-form-item>
              <el-form-item
                v-if="editShowChild"
                label="密码"
                prop="password"
                :rules="editShowChild ? rules.password : [{ required:false}]"
              >
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
              <el-form-item label="密码强度" v-if="editShowChild">
                <el-row>
                  <el-col :span="24">
                    <div class="password-level-box f ai-c">
                      <div class="password-level f ai-c">
                        <div
                          :style="{
                            'background-color':
                              passwordLevel > 0 ? '#00d000' : ''
                          }"
                        />
                        <div
                          :style="{
                            'background-color':
                              passwordLevel > 1 ? 'orange' : ''
                          }"
                        />
                        <div
                          :style="{
                            'background-color': passwordLevel > 2 ? 'red' : ''
                          }"
                        />

                        <span
                          v-if="passwordLevel === 1"
                          class=" fs12 ml5"
                          style="color:#00d000"
                        >
                          弱
                        </span>
                        <span
                          v-if="passwordLevel === 2"
                          class=" fs12 ml5"
                          style="color:orange"
                        >
                          中
                        </span>
                        <span
                          v-if="passwordLevel === 3"
                          class=" fs12 ml5"
                          style="color:red"
                        >
                          强
                        </span>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                v-if="editShowChild"
                label="确认密码"
                prop="rePassword"
                :rules="editShowChild ? rules.rePassword : [{ required:false}]"
              >
                <el-input v-model="dialog.params.rePassword" />
              </el-form-item>
              <el-form-item label="所属角色" prop="roleId">
                <el-select v-model="dialog.params.roleId" placeholder="请选择">
                  <el-option
                    v-for="i in gender"
                    :key="i.id"
                    :label="i.label"
                    :value="i.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="账号状态">
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="昵称" prop="nickName">
                <el-input
                  v-model="dialog.params.nickName"
                  placeholder="最多40个字符"
                />
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="dialog.params.name"
                  placeholder="最多20个字符"
                />
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="dialog.params.mobile" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="dialog.params.email" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('accountForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="passwordVisible" width="550px">
      <el-form
        ref="savePasswordForm"
        :model="passwordForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="password">
          <div class="f fd-c mr30">
            <el-input
              v-model="passwordForm.password"
              placeholder="6~20字符"
              class="new_password_input"
              @input="checkPassworLevel1"
            />
            <span class="fs12 mt10"
              >请使用大写字母（A~Z）、小写字母（a~z）、数字（0~9）三种组合</span
            >
          </div>
        </el-form-item>
        <el-form-item label="密码强度">
          <el-row>
            <el-col :span="24">
              <div class="password-level-box f ai-c">
                <div class="password-level f ai-c">
                  <div
                    :style="{
                      'background-color': passwordLevel1 > 0 ? '#00d000' : ''
                    }"
                  />
                  <div
                    :style="{
                      'background-color': passwordLevel1 > 1 ? 'orange' : ''
                    }"
                  />
                  <div
                    :style="{
                      'background-color': passwordLevel1 > 2 ? 'red' : ''
                    }"
                  />

                  <span
                    v-if="passwordLevel1 === 1"
                    class=" fs12 ml5"
                    style="color:#00d000"
                  >
                    弱
                  </span>
                  <span
                    v-if="passwordLevel1 === 2"
                    class=" fs12 ml5"
                    style="color:orange"
                  >
                    中
                  </span>
                  <span
                    v-if="passwordLevel1 === 3"
                    class=" fs12 ml5"
                    style="color:red"
                  >
                    强
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            v-model="passwordForm.rePassword"
            class="new_password_input"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePassword('savePasswordForm')"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
import {
  otherUnitAdd,
  otherUnitEdit,
  otherUnitList,
  otherUnitDelete,
  otherUnitEditPassword,
  otherUnitRoleId
} from "@/api/method/otherUnitManagement";
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
      passwordForm: {
        password: "",
        rePassword: "",
        id: ""
      },
      passwordVisible: false,
      rules: {
        account: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "6-20个字符",
            trigger: "blur"
          }
          // {
          //   validator: (rule, value, callback) => {
          //     if (!this.role.roleId) {
          //       this.$api.role.check(value).then((r) => {
          //         if (!r.data) {
          //           callback('该角色名称已存在')
          //         } else {
          //           callback()
          //         }
          //       })
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur'
          // }
        ],
        name: {
          required: true,
          message: "不能为空",
          trigger: "blur",
          max: 20
        },
        mobile: {
          pattern: /^(1[3-9]\d{9})$/,
          message: "请输入正确的手机号码",
          trigger: "blur",
          required: true
        },
        password: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (this.handlePasswordLevel(value)) {
                callback();
              } else {
                callback("密码强度不够，至少包含数字/字母/字符两种组合");
              }
            },
            trigger: "blur"
          }
        ],
        rePassword: {
          required: true,
          message: "不能为空",
          trigger: "blur"
        },
        nickName: {
          required: true,
          message: "不能为空",
          trigger: "blur",
          max: 40
        },
        email: {
          required: true,
          message: "不能为空",
          trigger: "blur"
        },
        roleId: {
          required: true,
          message: "不能为空",
          trigger: "blur"
        }
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0
      },
      tableData: [],
      editShow: true,
      editShowChild:true,
      editId:'',
      dialog: {
        show: false,
        title: "新增用户",
        params: {
          account: "",
          roleId: 1,
          status: 1,
          password: "",
          rePassword: "",
          nickName: "",
          name: "",
          email: "",
          deptId: 1
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
      passwordLevel1: 0,
      headers: {
        Authorization: Local.getToken()
      }
    };
  },
  watch: {
      'editShow'(){
        this.$nextTick(() =>{
          // this.dialogShow();
        })
      }
    },
  mounted() {
    this.checkPassworLevel();
    this.getOtherUnitList();
  },
  methods: {
    /**
     * 编辑超管密码
     */
    editPassword(row) {
      this.passwordVisible = true;
      this.passwordForm.id = row.id;
    },

    savePassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            !this.handlePasswordCheck(
              this.passwordForm.password,
              this.passwordForm.rePassword
            )
          ) {
            return;
          }
          otherUnitEditPassword(
            { id: this.passwordForm.id, password: this.passwordForm.password }
          ).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.passwordVisible = false;
              this.getOtherUnitList();
            }
          });
        }
      });
    },
    /**
     * 校验密码强度
     * @param {password} 密码
     */
    handlePasswordLevel(password) {
      let level = 0;
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(password)) {
        level++;
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(password)) {
        level++;
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(password)) {
        level++;
      }
      if (level >= 2) {
        return true;
      } else {
        this.$message.error("密码强度不够，至少包含数字/字母/字符两种组合");
        return false;
      }
    },
    /**
     * 校验密码
     * @param {password} 新密码
     * @param {rePassword} 确认密码
     */
    handlePasswordCheck(password, rePassword) {
      if (!password) {
        this.$message.error("请输入密码");
        return false;
      }
      if (!rePassword) {
        this.$message.error("请确认新密码");
        return false;
      }
      if (password && rePassword && password.trim() !== rePassword.trim()) {
        this.$message.error("两次输入的密码不一致");
        return false;
      }
      return true;
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.getOtherUnitList();
    },
    currentChange(proCount) {
      this.params.proCount = proCount;
      this.getOtherUnitList();
    },
    goPage(path, query) {
      this.$router.push(path);
    },
    dialogShow(act, data) {
      this.dialog.params = {
        account: "",
        roleId: 10000001,
        status: 1,
        password: "",
        rePassword: "",
        nickName: "",
        name: "",
        email: "",
        deptId: 1
      };
      this.editShow = true;
      if (act === 0) {

        // this.editShow = false;
        this.editShowChild = false;
        const { account, email, mobile, name, nickName, status, roleId } = data;
        this.dialog.params.account = account;
        this.dialog.params.email = email;
        this.dialog.params.mobile = mobile;
        this.dialog.params.name = name;
        this.dialog.params.nickName = nickName;
        this.dialog.params.status = Number(status);
        this.dialog.params.roleId = roleId;
        this.editId=data.id;
      }else{
        this.editShowChild = true;
      }
      this.dialog.title = act ? "添加账号" : "编辑用户";
      this.dialog.show = !this.dialog.show;
    },

    deleteAccount(row) {
      this.$confirm("删除后数据无法恢复，是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        otherUnitDelete(row.id).then(res => {
          if (res.code === 10000) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getOtherUnitList();
          }
        });
      });
    },
    getOtherUnitList() {
      otherUnitList(
        {
          ...this.params,
          current: this.params.pageNum,
          size: this.params.pageSize
        }
      ).then(res => {
        if (res.code === 10000) {
          this.tableData = res.data.records;
          this.params.total = res.data.total;
          this.params.pages = res.data.pages;
          this.params.current = res.data.current;
        }
      });
    },

    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.dialog.title) {
            case "添加账号":
              if (
                !this.handlePasswordCheck(
                  this.dialog.params.password,
                  this.dialog.params.rePassword
                )
              ) {
                return;
              }
              otherUnitAdd(this.dialog.params).then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: "其他单位账号新增成功"
                  });
                  this.dialog.show = false;
                  this.getOtherUnitList();
                }
              });
              break;
            case "编辑用户":

              otherUnitEdit({id:this.editId,...this.dialog.params}).then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: "success",
                    message: "账号修改成功"
                  });
                  this.dialog.show = false;
                  this.getOtherUnitList();
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
    checkPassworLevel1() {
      const reg = /[A-Z]/;
      const reg2 = /[a-z]/;
      const reg3 = /[0-9]/;
      this.passwordLevel1 = 0;
      reg.test(this.passwordForm.password) && (this.passwordLevel1 += 1);
      reg2.test(this.passwordForm.password) && (this.passwordLevel1 += 1);
      reg3.test(this.passwordForm.password) && (this.passwordLevel1 += 1);

      const l = this.passwordForm.password.length;
      if (l < 5 || l > 20) {
        this.passwordLevel1 = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 120px;
}
.new_password_input {
  width: 380px;
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
