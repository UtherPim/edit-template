import Vue from 'vue'
import $ from 'jquery'
Vue.prototype.$ = $
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'view-design/dist/styles/iview.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/icons' // icon
import App from './App.vue'

Vue.use(ElementUI)
Vue.config.productionTip = false

export default new Vue({
  render: h => h(App),
}).$mount('#app')
