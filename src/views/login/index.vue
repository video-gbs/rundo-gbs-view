<template>
  <div class="login" id="login">
    <div class="wrap-top" v-if="showHome">
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
                    <div class="login-middle-input">
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
                    <div class="login-middle-input">
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
                  <el-button
                    @click="handleLogin('loginForm')"
                    :loading="loading"
                    >登录</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div id="mapContainerTest"></div> -->
  </div>
</template>

<script>
import { getMenuLists } from '@/api/method/user'
import {
  getHomeUser,
  newLoginN,
  newRefreshToken,
  getHomeFunc
} from '@/api/method/home'
import { Local, Session } from '@/utils/storage'
import store from '@/store/index'
import Layout from '@/layout/index'

import axios from 'axios'

// import { Run3D } from '../../../node_modules/@rjgf/run3d'
import * as Run3D from '@rjgf/run3d'
import '@rjgf/run3d-engine/Build/Cesium/Widgets/widgets.css'
// let Map = require('@rjgf/run3d')
// import '@rjgf/run3d-engine/Build/Cesium/Widgets/widgets.css'
window._AMapSecurityConfig = {
  // 设置安全密钥
  securityJsCode: '53f79308351ca5147392f915cfc133d5'
}

export default {
  name: 'Login',
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '' || value === null || value.length === 0) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '' || value === null || value.length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
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
      // redirect: undefined,
      windowWidth: null,
      hasGoPath: '',
      thirdPartyLogin: false,
      showHome: false,
      resFuncId: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log('routerouterouterouteroute', route)
        // this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
    // windowWidth: {
    //   handler: function (val, oldVal) {
    //     const h = document.getElementsByTagName('HTML')[0]
    //     h.style.setProperty('--web-zoom', this.windowWidth / 1920)

    //     this.$forceUpdate()
    //   },
    //   immediate: true
    // }
  },
  created() {},
  mounted() {
    // this.initMap()
    // this.windowWidth = document.documentElement.clientWidth
    // window.onresize = this.throttle(this.setScale, 500, 500)

    store.dispatch('user/changeThirdPartyLogin', false)
    clearInterval(window.interval)
    clearInterval(window.interval1)
    Session.set('permissionData', [])
    Session.set('permissionMenuId', '')
    Local.set('expires_in', '')
    Local.clear()
    Local.remove('access_token')
    Local.remove('utilTime')
    Local.remove('expires_in')
    Local.remove('refresh_token')

    Session.set('third_party_login', false)
    this.thirdPartyLogin = false

    if (window.location.search.indexOf('access_token') !== -1) {
      this.showHome = false
      const resUrl = decodeURIComponent(window.location.search)
      console.log('resUrl', resUrl)
      const resObj = this.getUrlParams(resUrl)
      console.log('resObj', resObj)

      const accessToken1 = resObj.access_token
      const refreshToken1 = resObj.refresh_token_url
      const expiresIn1 = Number(resObj.expires_in)
      const tokenType1 = resObj.token_type
      const goPath = resObj.redirect_route
      this.thirdPartyLogin = true
      this.hasGoPath = resObj.redirect_route

      Session.set('third_party_login', true)

      Local.set('goPath', goPath)

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
    } else {
      this.showHome = true
    }
  },
  methods: {
    // routerChildren(data, arr) {
    //   let childArr = []
    //   data.forEach((datas, index) => {
    //     arr.push({
    //       path: datas.path,
    //       name: datas.name,
    //       types: datas.types,
    //       hidden: datas.disabled === 1 ? true : false,
    //       component:
    //         datas.component === 'Layout'
    //           ? Layout
    //           : (resolve) => require([`@/views${datas.component}`], resolve),
    //       meta: {
    //         title: datas.name,
    //         icon: datas.icon
    //       },
    //       id: datas.id,
    //       // 子路由
    //       children: []
    //     })

    //     if (datas.childList && datas.childList.length > 0) {
    //       childArr = this.routerChildren(datas.childList, [])
    //       arr[index].children = childArr
    //     }
    //   })
    //   return arr
    // },

    findFuncId(data) {
      data.forEach((datas, index) => {
        if (datas.path === `/${Local.get('goPath')}`) {
          this.resFuncId = datas.id
        }
        if (datas.childList && datas.childList.length > 0) {
          this.findFuncId(datas.childList)
        }
      })
    },

    routerChild(data) {
      let resRouterChildren = []
      let childTemp = {}
      let childArr = []
      data.forEach((item, i) => {
        // 组装路由配置
        childTemp = {
          name: item.name,
          path: item.path,
          id: item.id,
          meta: { icon: item.icon, title: item.name },
          component: item.component
        }
        if (item.childList && item.childList.length > 0) {
          childArr = this.routerChild(item.childList)
          childTemp.children = childArr
        }
        resRouterChildren.push(childTemp)
      })
      return resRouterChildren
    },
    saveComponents(data) {
      const homeRouters = [
        {
          path: '/workTable',
          name: 'workTable',
          component: () => import('@/views/leftMenus/workTable/index'),
          meta: { title: '首页', icon: 'sy' }
        }
      ]

      if (data && data.length > 0) {
        let typeRouter = []
        let resData = []

        data.map((datas) => {
          datas.childList.map((item) => {
            // let params = {}
            let params1 = {}
            let params2 = {}
            // params = {
            //   path: item.path,
            //   meta: { icon: item.icon, title: item.name },
            //   name: item.name,
            //   id: item.id,
            //   component: Layout,
            //   children: this.routerChildren(item.childList, [])
            // }
            params1 = {
              path: item.path,
              meta: { icon: item.icon, title: item.name },
              name: item.name,
              id: item.id
            }
            params2 = {
              path: item.path,
              meta: { icon: item.icon, title: item.name },
              name: item.name,
              icon: item.icon,
              id: item.id,
              component: item.component,
              children: this.routerChild(item.childList)
            }
            typeRouter.push(params1)
            resData.push(params2)
          })
        })

        store.dispatch('user/dynamicRouters', [])

        store.dispatch('user/changeDynamicRouters', [])

        store.dispatch('user/dynamicRouters', resData)

        store.dispatch('user/changeDynamicRouters', resData)

        store.dispatch('user/changeTypeRouter', [])

        store.dispatch('user/changeTypeRouter', homeRouters.concat(typeRouter))
      }
    },
    getHomeUser() {
      getHomeUser()
        .then((res) => {
          if (res.data.code === 0) {
            Local.set('rj_userName', res.data.data.workName)
            if (
              this.hasGoPath &&
              this.hasGoPath !== '' &&
              this.thirdPartyLogin
            ) {
              getMenuLists({ levelNumStart: 1, levelNumEnd: 3 })
                .then((res) => {
                  if (res.data.code === 0) {
                    console.log('第三方请求')
                    // this.allDataLists = res.data.data
                    store.dispatch('user/changeThirdPartyLogin', true)

                    this.saveComponents(res.data.data)

                    // getMenuLists({ levelNumStart: 1, levelNumEnd: 3 })
                    //   .then((res) => {
                    //     if (res.data.code === 0) {
                    this.findFuncId(res.data.data)

                    Session.set('permissionData', [])
                    Session.set('permissionMenuId', '')
                    Session.set('isShowSideRouter', 1)
                    getHomeFunc({
                      menuId: this.resFuncId
                    }).then((res) => {
                      if (res.data.code === 0) {
                        Session.set('permissionData', res.data.data)
                        Session.set('permissionMenuId', this.resFuncId)
                      }
                    })

                    this.$nextTick(() => {
                      store.dispatch('user/changeRightWidth', false)
                      store.dispatch('user/changeShowSidebar', false)
                      this.$router.push({ path: `/${this.hasGoPath}` })
                      this.hasGoPath = ''
                    })
                    //   }
                    // })
                    // .catch((error) => {
                    //   console.log(error)
                    // })
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            } else {
              this.showHome = true
              // store.dispatch('user/changeThirdPartyLogin', false)
              this.$router.push({ path: '/workTable' })
            }
            //设置定时器，更新token
            if (Local.get('expires_in_old') && Local.get('refresh_token')) {
              clearInterval(window.interval1)
              window.interval1 = setInterval(function () {
                if (Session.get('third_party_login')) {
                  const resUrl = `${Local.get(
                    'refresh_token_url'
                  )}?accessToken=${Local.get('access_token')}`
                  axios({
                    method: 'get',
                    url: resUrl,
                    headers: {
                      Authorization: 'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
                    }
                  }).then((res) => {
                    if (res.data.code === 0) {
                      const { accessToken, refreshToken, expiresIn } =
                        res.data.data
                      Local.set('access_token', accessToken)
                      Local.set('refresh_token', refreshToken)
                      Local.set('expires_in', expiresIn)
                      Local.set('expires_in_old', expiresIn)
                      let timestamp = expiresIn
                      clearInterval(window.interval)

                      window.interval = setInterval(() => {
                        timestamp = timestamp - 1
                        Local.set('expires_in', timestamp)
                      }, 1000)
                    }
                  })
                } else {
                  if (Local.get('access_token') && Local.get('expires_in')) {
                    newRefreshToken(
                      Local.get('refresh_token'),
                      'Basic cnVuZG8tZ2JzLXZpZXc6cnVuZG84ODg='
                    ).then((res) => {
                      if (res.data && res.data.code === 0) {
                        const { accessToken, refreshToken, expiresIn } =
                          res.data.data
                        Local.set('access_token', accessToken)
                        Local.set('refresh_token', refreshToken)
                        Local.set('expires_in', expiresIn)

                        Local.set('expires_in_old', expiresIn)

                        let timestamp = expiresIn
                        clearInterval(window.interval)

                        window.interval = setInterval(() => {
                          timestamp = timestamp - 1
                          Local.set('expires_in', timestamp)
                        }, 1000)
                      }
                    })
                  }
                }
              }, (Local.get('expires_in_old') * 1000) / 4)
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getUrlParams(url) {
      let urlStr = url.split('?')[1] || ''
      let obj = {}
      let paramsArr = urlStr.split('&')
      for (let i = 0, len = paramsArr.length; i < len; i++) {
        const num = paramsArr[i].indexOf('=')
        let arr = [
          paramsArr[i].substring(0, num),
          paramsArr[i].substring(num + 1)
        ]
        obj[arr[0]] = arr[1]
      }
      return obj
    },
    initMap() {
      console.log('Run3DRun3DRun3DRun3DRun3D', Run3D)
      let map = new Run3D.Map()
      map.createMap('', 'mapContainerTest', {})
      //创建高德在线地图图层
      let gdOnlineMap = new Run3D.UrlTemplateImageLayer({
        url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', //高德地图
        minimumLevel: 0,
        maximumLevel: 23
      })
      map.layers.addRaster(gdOnlineMap)
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

    handleLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          Local.set('access_token', '')
          newLoginN(this.loginForm)
            .then((res) => {
              if (res.data.code === 0) {
                const { accessToken, refreshToken, expiresIn, tokenType } =
                  res.data.data

                Session.set('third_party_login', false)
                this.thirdPartyLogin = false

                this.hasGoPath = ''

                store.dispatch('user/changeThirdPartyLogin', false)

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
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
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

#mapContainerTest {
  height: 100%;
  width: 100%;
}
</style>
