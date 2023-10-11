import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import settings from './modules/settings'
import user from './modules/user'
import tabs from './modules/tabs'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    settings,
    user,
    tabs
  },
  getters
})

export default store
