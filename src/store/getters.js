const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.access_token,
  avatar: state => state.user.avatar,
  name: state => state.user.userName,
  nickName: state => state.user.nickName,
  roles: state => state.user.roles,
  permission: state => state.user.permission,
  permission_routes: state => state.permission.routes
}
export default getters
