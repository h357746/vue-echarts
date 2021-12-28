import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/SellerPage.vue'
import TrendPage from '../views/TrendPage.vue'
import MapPage from '../views/MapPage.vue'
import RankPage from '../views/RankPage.vue'
import HotPage from '../views/HotPage.vue'
import StockPage from '../views/StockPage.vue'
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
  },
  {
    path: '/rankpage',
    name: 'RankPage',
    component: RankPage
  },
  {
    path: '/hotpage',
    name: 'HotPage',
    component: HotPage
  },
  {
    path: '/stockpage',
    name: 'StockPage',
    component: StockPage
  }
]

const router = new VueRouter({
  routes
})

export default router
