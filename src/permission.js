import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Local } from '@/utils/storage'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
let asyncRouter
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const hasToken = Local.getToken()
if (whiteList.indexOf(to.path) !== -1 && !hasToken) {
  asyncRouter = null
  next()
} else {
  // token存在-
  if (hasToken) {
    if (to.path == '/404') {
      Message({
        message: '页面不存在',
        type: 'error'
      })
      NProgress.done()
      next('/')
    } else {
      isLogin(to, next, () => {
        next()
      })
    }
  } else {
    asyncRouter = null
    next('/login')
  }
}

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
