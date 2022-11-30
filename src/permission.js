import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Local } from '@/utils/storage'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
let asyncRouter
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const hasToken = Local.getToken()
  // if (whiteList.indexOf(to.path) !== -1 && !hasToken) {
  //   asyncRouter = null
  //   next()
  // } else {
  // token存在-
  document.title = getPageTitle(to.meta.title)
  if (to.path === '/login') {
    next()
  } else if (to.path == '/404') {
    Message({
      message: '页面不存在',
      type: 'error'
    })
    NProgress.done()
    next('/404')
  } else {
    if (hasToken) {
      next()
    } else {
      console.log('4021')
      asyncRouter = null
      next('/login')
    }
  }

  // }
})

// 如果跳往登录页，则转到首页
function isLogin(to, next, callback) {
  if (to.path == '/login') {
    next('/')
  } else {
    callback()
  }
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
