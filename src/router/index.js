import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('../views/Todo.vue'),
      name: 'todos'
    },
    {
      path: '/articles',
      component: () => import('../views/Article.vue'),
      name: 'articles'
    }
  ]
})

export default router
