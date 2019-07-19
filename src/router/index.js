import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登陆页面
import Login from '@/views/login.vue'
Vue.use(VueRouter)
var router = new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

export default router
