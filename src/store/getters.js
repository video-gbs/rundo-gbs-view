const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  routerLists: (state) => state.user.routerLists,
  activeIndex: (state) => state.user.activeIndex,
  rightWidth: (state) => state.user.rightWidth,
  showSidebar: (state) => state.user.showSidebar,
  thirdPartyLogin1: (state) => state.user.thirdPartyLogin1,
  typeRouter: (state) => state.user.typeRouter,
  sidebarRouter: (state) => state.user.sidebarRouter,
  // configTypeRouter: (state) => state.user.configTypeRouter,
  init: (state) => state.user.init,
  menuModule: (state) => state.tabs.menuModule,
  activeTabsName: (state) => state.tabs.activeTabsName,
  tabList: (state) => state.tabs.tabList
}
export default getters
