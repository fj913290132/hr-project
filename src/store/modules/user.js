import { loginAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(), //! vuex的state值，使用本地持久化的(刷新时默认去本地取)
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token//! vuex中存一份
    setToken(token)//! 再给本地存一份token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  //! 删除token
  REMOVE_TOKEN(state) {
    state.token = ''
    removeToken()
  }
}

const actions = {
//! 封装的登录逻辑
  async loginActions({ commit }, data) {
    const res = await loginAPI(data)
    // console.log(res)
    commit('SET_TOKEN', res.data)
    return res // 把结果返回
    //! async函数return的值，只要不是promise.reject(),都是成功的值
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

