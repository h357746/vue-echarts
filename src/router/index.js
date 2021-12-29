import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '../views/ScreenPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: ScreenPage
  }

]

const router = new VueRouter({
  routes
})

export default router
