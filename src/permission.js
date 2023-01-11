import router from './router'
import { pageAuthor } from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Local } from '@/utils/storage'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
})

router.beforeEach(async (to, from, next) => {
  const ut = +(localStorage.getItem('rj_wzwz_deptType') || 999)
  NProgress.start()

  const hasToken = Local.getToken()
  if (to.path === '/login') {
    hasToken ? next('/workTable') : next()
  } else if (to.path == '/404') {
    Message({
      message: '页面不存在',
      type: 'error'
    })

    next('/404')
  } else {
    if (hasToken) {
      // console.log(';pageAuthor[to.name]', pageAuthor[to.name].includes(ut))
      if (!pageAuthor[to.name]) {
        // 没有权限要求，直接放行
        next()
      } else {
        console.log(
          ';pageAuthor[to.name]',
          pageAuthor[to.name],
          to.name,
          pageAuthor[to.name].includes(ut)
        )
        if (pageAuthor[to.name].includes(ut)) {
          // 有权限
          next()
        } else {
          // next()
          next('/login')
        }
      }
    } else {
      next('/login')
    }
  }
  NProgress.done()
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
