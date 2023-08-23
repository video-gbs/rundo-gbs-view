<template>
  <div class="login" id="login">
    <div class="wrap-top">
      <div class="wrap-middle">
        <div class="wrap-middle-left">
          <div class="left-img"></div>
        </div>
        <div class="wrap-middle-right">
          <div class="wrap-middle-login">
            <div class="wrap-middle-login-head">
              <img src="../../assets/imgs/zlm-logo.png" />
              <span>视频联网平台</span>
            </div>
            <div class="wrap-middle-login-body">
              <div class="title-container f jc-c ai-c">
                <div class="title-box f jc-c ai-c fs28">账号登录</div>
              </div>
              <!-- <div class="login-password">
                <span>密码登录</span>
                <div></div>
              </div> -->
              <div class="login-middle">
                <el-form
                  ref="loginForm"
                  :model="loginForm"
                  :rules="loginRules"
                  auto-complete="on"
                  label-position="left"
                >
                  <el-form-item prop="username">
                    <div
                      class="login-middle-input"
                      data-validate="Valid email is: a@b.c"
                    >
                      <svg-icon class="svg-btn" icon-class="zhanghao" />
                      <input
                        ref="username"
                        :class="
                          'input100 ' +
                          (loginForm.username == '' ? '' : 'has-val')
                        "
                        type="text"
                        v-model="loginForm.username"
                        name="username"
                        placeholder="输入用户名"
                        style="width: 200px"
                      />
                    </div>
                  </el-form-item>

                  <el-form-item prop="password">
                    <div
                      class="login-middle-input"
                      data-validate="Enter password"
                    >
                      <svg-icon class="svg-btn" icon-class="mima" />
                      <input
                        ref="password"
                        :class="
                          'input100 ' +
                          (loginForm.password == '' ? '' : 'has-val')
                        "
                        :type="!showPassword ? 'password' : 'text'"
                        v-model="loginForm.password"
                        name="password"
                        placeholder="输入密码"
                      />
                    </div>
                  </el-form-item>

                  <!-- <el-form-item prop="code">
                    <div
                      class="login-middle-input-last login-middle-input"
                      data-validate="Valid email is: a@b.c"
                    >
                      <svg-icon class="svg-btn" icon-class="yzm" />
                      <input
                        ref="code"
                        :class="
                          'input100 ' + (loginForm.code == '' ? '' : 'has-val')
                        "
                        type="text"
                        v-model="loginForm.code"
                        name="username"
                        placeholder="输入验证码"
                      />
                    </div>
                  </el-form-item> -->
                  <!-- <div
                    @click="refreshCode()"
                    class="get-codes"
                    title="点击切换验证码"
                  >
                  </div> -->

                  <!-- <el-form-item>
                    <el-checkbox v-model="checked"
                      ><span class="rember-span"
                        >记住密码，下次自动登录</span
                      ></el-checkbox
                    >
                  </el-form-item> -->
                </el-form>
                <div class="login-footer-button">
                  <el-button @click="handleLogin" :loading="loading"
                    >登录</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div id="map_container"></div> -->
  </div>
</template>

<script>
import Code from '@/views/leftMenus/systemManagement//components/Code'

import { validUsername } from '@/utils/validate'
import { login } from '@/api/method/user'
import { getHomeUser, newLoginN } from '@/api/method/home'
import { Local } from '@/utils/storage'
import store from '@/store/index'

import axios from 'axios'

import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
  // 设置安全密钥
  securityJsCode: '53f79308351ca5147392f915cfc133d5'
}

export default {
  name: 'Login',
  components: { Code },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入账号'))
      } else {
        if (value.length < 6 || value.length > 20) {
          callback(new Error('账号长度6到20个字符'))
        } else {
          callback()
        }
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度6到20个字符'))
        } else {
          callback()
        }
      }
    }

    return {
      map: null,
      mouseTool: null,
      overlays: [],
      auto: null,
      placeSearch: null,
      identifyCode: '',
      // identifyCodes: ['0','1','2','3'...'a','b','c'...'z'],
      loginForm: {
        // admin/123456
        username: '',
        password: ''
        // code:''
      },
      checked: false,
      isLoging: false,
      showPassword: false,
      loginLoading: false,
      loginRules: {
        username: [
          { required: true, trigger: 'change', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'change', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      windowWidth: null
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    windowWidth: {
      handler: function (val, oldVal) {
        const h = document.getElementsByTagName('HTML')[0]
        h.style.setProperty('--web-zoom', this.windowWidth / 1920)

        this.$forceUpdate()
      },
      immediate: true
    }
  },
  mounted() {
    this.windowWidth = document.documentElement.clientWidth
    window.onresize = this.throttle(this.setScale, 500, 500)
    // this.initMap()
    Local.set('permissionData', [])
    Local.set('permissionMenuId', '')
    Local.set('expires_in', '')

    if (window.location.search.indexOf('access_token') !== -1) {
      console.log(111111111)
      const resUrl = decodeURIComponent(window.location.search)

      const accessToken1 = resUrl.slice(
        resUrl.lastIndexOf('access_token=') + 13,
        resUrl.lastIndexOf('&token_type')
      )
      const refreshToken1 = resUrl.slice(
        resUrl.lastIndexOf('refresh_token_url') + 18
      )
      const expiresIn1 = resUrl.slice(
        resUrl.lastIndexOf('expires_in=') + 11,
        resUrl.lastIndexOf('&refresh_token_url')
      )
      const tokenType1 = resUrl.slice(
        resUrl.lastIndexOf('token_type') + 11,
        resUrl.lastIndexOf('&expires_in')
      )
      Local.set('third_party_login', true)

      Local.set('rj_deptType', 0)
      Local.set('access_token', accessToken1)
      Local.set('refresh_token_url', refreshToken1)
      this.isRefreshTokenExpired(expiresIn1)
      Local.set('expires_in', expiresIn1)
      Local.set('expires_in_old', expiresIn1)
      Local.set('token_type', tokenType1)
      this.$nextTick(() => {
        // setTimeout(() => {
        console.log(22222)
        this.getHomeUser()
        // }, 500)
      })

      this.loading = false
    }
  },
  methods: {
    async getHomeUser() {
      await getHomeUser()
        .then((res) => {
          if (res.data.code === 0) {
            Local.set('rj_userName', res.data.data.workName)

            this.$router.push({ path: '/workTable' })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    initMap() {
      AMapLoader.load({
        key: '60e29aaeb21c23592a0396a255db259e', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        // "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map('map_container', {
            viewMode: '2D', //  是否为3D地图模式
            zoom: 13, // 初始化地图级别
            center: [113.459, 23.1064], //中心点坐标
            resizeEnable: true
          })

          this.auto = new AMap.AutoComplete({
            input: this.iptId // 搜索框的id
          })
          this.placeSearch = new AMap.PlaceSearch({
            map: this.map,
            panel: 'panel', // 结果列表将在此容器中进行展示。
            // city: "010", // 兴趣点城市
            autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            extensions: 'base' //返回基本地址信息
          })
          this.auto.on('select', this.select) //注册监听，当选中某条记录时会触发
        })
        .catch((e) => {
          console.log(e)
        })
    },

    select(e) {
      this.placeSearch.setCity(e.poi.adcode)
      this.placeSearch.search(e.poi.name) //关键字查询查询
    },

    pwdShowChange() {
      this.passwordType = this.passwordType === 'password' ? 'type' : 'password'
    },
    throttle(method, delay, duration) {
      var timer = null
      var begin = new Date()
      return function () {
        var context = this
        var args = arguments
        var current = new Date()
        clearTimeout(timer)
        if (current - begin >= duration) {
          method.apply(context, args)
          begin = current
        } else {
          timer = setTimeout(function () {
            method.apply(context, args)
          }, delay)
        }
      }
    },
    setScale() {
      // 以1920px为标准宽度
      this.windowWidth = document.documentElement.clientWidth
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    isRefreshTokenExpired(timestamp) {
      clearInterval(window.interval)
      window.interval = setInterval(() => {
        timestamp = timestamp - 1
        Local.set('expires_in', timestamp)
      }, 1000)
    },
    // 取到浏览器出现网址的最后"/"出现的后边的字符
    getLastUrl(str, starStr, lastStr) {
      str.slice(str.lastIndexOf(starStr), str.lastIndexOf(lastStr))
    },

    async handleLogin() {
      this.loading = true
      Local.set('access_token', '')
      await newLoginN(this.loginForm)
        .then((res) => {
          if (res.data.code === 0) {
            const { accessToken, refreshToken, expiresIn, tokenType } =
              res.data.data

            Local.set('third_party_login', false)

            this.getHomeUser()

            Local.set('rj_deptType', 0)
            Local.set('access_token', accessToken)
            Local.set('refresh_token', refreshToken)
            this.isRefreshTokenExpired(expiresIn)
            Local.set('expires_in', expiresIn)
            Local.set('token_type', tokenType)
            Local.set('expires_in_old', expiresIn)

            this.loading = false
          }
        })
        .catch((error) => {
          this.loading = false

          // this.$message({
          //   type: 'error',
          //   message: error.response.data.data
          // })
        })
        .finally(() => {
          this.loading = false
        })

      // axios({
      //   method: 'post',
      //   url: `http://xard-gbs-test.runjian.com:8080/api/oauth2/token?grant_type=password&scope=all&username=${this.loginForm.username}&password=${this.loginForm.password}`,
      //   headers: {
      //     Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
      //   }
      // })
      //   .then((res) => {
      //     const { accessToken, refreshToken, expiresIn, tokenType } =
      //       res.data.data

      //     this.getHomeUser()

      //     Local.set('rj_deptType', 0)
      //     Local.set('access_token', accessToken)
      //     Local.set('refresh_token', refreshToken)
      //     this.isRefreshTokenExpired(expiresIn)
      //     Local.set('expires_in', expiresIn)
      //     Local.set('token_type', tokenType)

      //     this.loading = false
      //   })
      //   .catch((error) => {
      //     console.log(1, error.response)

      //     this.loading = false

      //     this.$message({
      //       type: 'error',
      //       message: error.response.data.data
      //     })
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
    }
  }
}
</script>
<style lang="scss" scoped>
input::-ms-reveal {
  display: none;
}
body {
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  background-color: #f8f8f8;
  font-family: 'PingFangSC-Medium', 'PingFang SC', sans-serif;
  font-size: 14px;
  /*font-weight: bolder;*/
  line-height: 1.571428571;
}
.login {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  position: relative;

  .wrap-middle-right {
    flex: 1;
    margin-left: 5%;
    display: flex;
    justify-content: flex-start;
    position: relative;
    top: 260px;
  }
}
.get-codes {
  position: relative;
  top: -65px;
  right: 0px;
  float: right;
  cursor: pointer;
  width: 81px;
  height: 48px;
  background: #016bd5;
  border-radius: 4px;
}
.wrap-top {
  background-image: url('../../assets/imgs/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  height: 100%;
  position: relative;
  overflow: hidden;
  margin: 0;
}
.wrap-middle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 100%;
}
.wrap-middle-left {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  height: 1080px;

  .left-img {
    max-width: 775px;
    width: 100%;
    // height: 400px;
    background: url('../../assets/imgs/tysp.png') 100% no-repeat;
    background-size: cover;
  }
}
.wrap-middle-login {
  width: 420px;
  height: 407px;
  left: 70%;
  top: -5%;
}
.wrap-middle-login-head {
  height: 48px;
  margin-bottom: 29px;
  margin-left: 45px;
  img {
    width: 48px;
    height: 48px;
    float: left;
    margin-right: 12px;
  }

  span {
    float: left;
    font-size: 40px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.18);
    -webkit-background-clip: text;
  }
}
.wrap-middle-login-body {
  position: absolute;
  width: 400px;
  height: 447px;
  background: #ffffff;
  box-shadow: 0px 10px 20px 1px rgba(156, 169, 188, 0.25);
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  padding: 25px 30px 40px 30px;
  .title-container {
    position: absolute;
    top: -10px;
    left: 0px;
    width: 100%;
    height: 56px;

    .title-box {
      width: 304px;
      height: 56px;
      background-image: url('../../assets/imgs/bt-logo.png');
      background-size: cover;
      background-repeat: no-repeat;
      color: #fff;
    }
  }
}
.login-password {
  position: relative;
  top: 16px;
  z-index: auto;
  width: 100%;
  min-height: 44px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  font-weight: 600;

  span {
    z-index: 66;
    width: 80px;
    /*display: block;*/
    overflow-wrap: break-word;
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    font-family: PingFangSC-Medium;
    white-space: nowrap;
    line-height: 28px;
    text-align: left;
    margin-top: 16px;
    border-bottom: #1d2c6a 2px solid;
    padding-bottom: 16px;
  }

  div {
    z-index: 64;
    width: 100%;
    height: 1px;
    align-self: flex-start;
    margin-top: 13px;
  }
}
.login-middle {
  position: relative;
  top: 18%;
  .login-middle-input-last {
    width: 70%;
  }

  .login-middle-input {
    outline: none;
    display: flex;
    flex: 1;
    min-width: 50px;
    height: 48px;
    padding: 0px 14px;
    border: 1px solid #f2f2f2;
    border-radius: 2px;
    background-color: #fff;
    background-image: none;
    box-shadow: none;
    font-size: 14px;
    line-height: 1.571428571;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;

    input {
      border: none;
      padding: 0;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      margin-left: 10px;
      background-color: #ffffff;
      -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
    }

    label {
      z-index: 61;
      width: 60px;
      display: block;
      overflow-wrap: break-word;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      font-family: PingFangSC-Regular;
      white-space: nowrap;
      line-height: 40px;
      text-align: justify;
      font-weight: bolder;
      margin: 0px 26px 0px 0px;
      text-align: center;
    }
  }
  .svg-btn {
    position: relative;
    top: 15px;
    left: -4px;
  }
  .rember-span {
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #c1c9ce;
  }
}

.login-footer-button {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 95px;

  button {
    font-family: Poppins-Medium;
    font-size: 14px;
    color: #fff;
    line-height: 1.2;
    text-transform: uppercase;

    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 224px;
    height: 38px;
    border-radius: 10px;
    outline: none !important;
    border: none;
    background-color: #1e56a0;
    cursor: pointer;
  }
}
.wrap-footer {
  display: flex;
  height: 4vh;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}
.wrap-footer span {
  font-weight: normal;
  display: block;
  overflow-wrap: break-word;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  white-space: nowrap;
  line-height: 4vh;
}

/* start 媒体查询 */
@media screen and (max-width: 970px) {
  .login {
    .wrap-middle-left {
      display: none !important;
    }

    .wrap-middle-right {
      margin-left: 0;
      justify-content: center;
    }
  }
}

#map_container {
  height: 100%;
  width: 100%;
}
</style>
