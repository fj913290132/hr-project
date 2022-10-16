import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] //! 无需登录，可以查看的路由

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    //! 登录了
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      if (!store.getters.name) { store.dispatch('user/getUserInfoActions') }
      next()
    }
  } else {
    //! 没有登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
