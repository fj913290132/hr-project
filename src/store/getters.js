const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 用户头像
  name: state => state.user.userInfo.username, // 要显示的用户名
  comanyId: state => state.user.userInfo.comanyId // 返回公司ID
}
export default getters
