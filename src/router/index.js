import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登陆页面
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/users/user.vue'
import Right from '@/views/rights/right.vue'
import Roles from '@/views/rights/roles.vue'
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
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'right',
          path: 'rights',
          component: Right
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        }
      ]
    }
  ]
})

export default router
