import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  // process.env 是nodejs内置的固定环境变量对象
  // npm run dev -> 启动开发服务，项目根目录 .env.development 环境变量配置文件里值
  // 添加到process.env对象上
  // npm run build:prod -> 启动打包，项目根目录 .env.production 环境变量配置文件里值
  // 添加到process.env对象上
  // 不写在这里是因为开发用的基地址1，上线用基地址2
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) { //! 本地有token，在发请求的时候统一携带token
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    //! 因为后台不管成功/失败返回都是200，用success区分
    //! data.data返回的才是后台返回的全部数据
    const { success, message } = response.data
    if (success) {
      return response.data
    } else {
      //! 逻辑失败
      Message.error(message)
      return Promise.reject(message)
    }
  },
  error => {
    console.dir(error)
    // 4xx/5xx的响应状态，如果后台返回了响应数据，我们就用一下
    Message.error((error.response && error.response.data && error.response.data.message) || error.message)
    //! 上面是报错就提示，下面是具体的分析
    //! 可以用http状态码来判断 error.response.status === 401
    //! 或者还可以用code逻辑码来判断
    if (error?.response?.data?.code === 10002) {
      //! 前端个token过期：清除token(vuex和本地都有)、清除用户信息、返回login页面
      store.dispatch('user/logoutActions')
      //! 返回登录页
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
    }
    return Promise.reject(error)
  }
)

export default service
