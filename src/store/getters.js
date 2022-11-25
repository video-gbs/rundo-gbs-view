const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menuModule: state => state.tabs.menuModule,
  activeTabsName: state => state.tabs.activeTabsName,
  tabList: state => state.tabs.tabList,
}
export default getters
