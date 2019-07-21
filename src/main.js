import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入路由
import router from '@/router/index.js'
// 引入公共样式
import '@/style/index.less'
// 设置前置的导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  let token = localStorage.getItem('itcast_token')
  if (token || to.path === '/login') {
    next()
  } else {
    // 否则就重定向到登录页
    next({ name: 'login' })
  }
})
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
