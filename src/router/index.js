import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/SellerPage.vue'
import TrendPage from '../views/TrendPage.vue'
import MapPage from '../views/MapPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    name: 'SellerPage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    name: 'TrendPage',
    component: TrendPage
  },
  {
    path: '/mappage',
    name: 'MapPage',
    component: MapPage
  }
]

const router = new VueRouter({
  routes
})

export default router
