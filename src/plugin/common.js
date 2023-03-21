import Vue from 'vue'
// 自定义组件全局加载
import PQuery from '@/components/PQuery'
import PDataBox from '@/components/PDataBox'
import PForm from '@/components/PForm'
import PTablePage from '@/components/PTablePage'
import PDialog from '@/components/PDialog'
import PFileUpload from '@/components/PFileUpload'
import PEditor from '@/components/PEditor'
import PVideo from '@/components/PVideo'

const Loading = {
  install: function (Vue) {
    Vue.component('PQuery', PQuery)
    Vue.component('PDataBox', PDataBox)
    Vue.component('PForm', PForm)
    Vue.component('PTablePage', PTablePage)
    Vue.component('PDialog', PDialog)
    Vue.component('PFileUpload', PFileUpload)
    Vue.component('PEditor', PEditor)
    Vue.component('PVideo', PVideo)
  }
}

Vue.use(Loading)
