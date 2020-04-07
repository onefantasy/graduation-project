const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userInfo: state => state.user.info,
  // 常量
  constant: state => state.constant,
  // 侧边栏
  routes: state => state.permission.routes
}
export default getters
