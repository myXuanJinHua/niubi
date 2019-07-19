import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登陆页面
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
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
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    }
  ]
})

export default router
