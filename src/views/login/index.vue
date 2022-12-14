<template>
  <div class="login-container f jc-c ai-c">
    <div class="login-box f fd-c ai-c">
      <div class="login-label fs48 f jc-c ai-c mb46">
        梧州零距离问政后台系统
      </div>
      <div class="login-div">
        <div class="title-container f jc-c ai-c">
          <div class="title-box f jc-c ai-c fs28">账号登录</div>
        </div>
        <div class="login-form r15">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="ph30 pv28 pt99"
            auto-complete="on"
            label-position="left"
          >
            <el-form-item prop="account">
              <el-input
                ref="account"
                v-model="loginForm.account"
                placeholder="输入用户名"
                name="account"
                type="text"
                tabindex="1"
                auto-complete="on"
              >
                <i slot="prefix" class="icon-css icon-username" />
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="输入密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              >
                <i slot="prefix" class="icon-css icon-password" />
                <i
                  slot="suffix"
                  class="icon-css icon-password"
                  @click="pwdShowChange(item)"
                />
              </el-input>
            </el-form-item>

            <!-- <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="输入验证码"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item> -->
            <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->
          </el-form>
          <div class="f jc-c ai-c">
            <el-button
              class="r10"
              :loading="loading"
              type="primary"
              style="margin-bottom: 30px; width: 224px; height: 38px"
              @click.native.prevent="handleLogin"
              >登录</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { login } from "@/api/method/user";
import { Local } from "@/utils/storage";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入账号"));
      } else {
        if (value.length < 6 || value.length > 20) {
          callback(new Error("账号长度6到20个字符"));
        } else {
          callback();
        }
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 6 || value.length > 20) {
          callback(new Error("密码长度6到20个字符"));
        } else {
          callback();
        }
      }
    };

    return {
      loginForm: {
        // adminsuper/123456
        account: "",
        password: "",
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          login(this.loginForm)
            .then((res) => {
              if (res.code === 10000) {
                const { deptName, deptType, userName, token } = res.data;
                Local.setToken(token);
                Local.set("rj_wzwz_token", token);
                Local.set("rj_wzwz_deptType", deptType);
                Local.set("rj_wzwz_userName", userName);
                Local.set("rj_wzwz_deptName", deptName);
                this.$router.push({ path: "/workTable" });
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<!-- <style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    margin-left: 10px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $cursor !important;
      }
    }

  }

  .el-form-item {
    border: 1px solid rgba(242, 242, 242, 1) !important;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style> -->

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  background-image: url("~@/assets/imgs/login/bg.png");
  background-size: cover;
  .login-box {
    width: 100%;
    .login-label {
      color: #fff;
    }

    .login-div {
      position: relative;
      width: 400px;
      // height: 457px;
      height: 347px;
      max-width: 100%;

      overflow: hidden;

      .title-container {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 56px;

        .title-box {
          width: 304px;
          height: 56px;
          background-image: url("~@/assets/imgs/login/header.png");
          background-size: cover;
          background-repeat: no-repeat;
          color: #fff;
        }
      }
    }
    .icon-css {
      width: 18px;
      height: 18px;
      background-size: cover;
      color: #eee;
      display: block;
      margin: 10px;
    }
    .icon-username {
      background-image: url("~@/assets/imgs/login/username.png");
    }
    .icon-password {
      background-image: url("../../assets/imgs/login/password.png");
    }
    .login-form {
      margin-top: 10px;
      width: 400px;
      // height: 447px;
      background-color: #fff;
      max-width: 100%;
      box-shadow: 0px 3px 24px rgba(0, 53, 123, 0.44);
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .el-input {
    width: 340px;
    height: 48px;
    ::v-deep input {
      text-indent: 16px !important;
    }
  }
}
</style>
