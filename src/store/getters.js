const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  // 昵称
  name: state => state.user.name,
  // 菜单
  menus: state => state.user.menus,
  // 权限路由
  permission_routes: state => state.permission.routes
}
export default getters
