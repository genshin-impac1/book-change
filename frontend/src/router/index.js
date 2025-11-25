import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/book/:id', name: 'BookDetail', component: () => import('../views/BookDetail.vue') },
  { path: '/upload', name: 'Upload', component: () => import('../views/BookUpload.vue') },
  { path: '/cart', name: 'Cart', component: () => import('../views/Cart.vue') },
  { path: '/orders', name: 'Orders', component: () => import('../views/OrderList.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/Admin.vue') },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
// 路由守卫：未登录跳转登录页
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('token')
  if (!user && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})