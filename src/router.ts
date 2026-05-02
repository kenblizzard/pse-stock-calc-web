import { createRouter, createWebHashHistory } from 'vue-router'
import BuyingPowerPage from './pages/BuyingPowerPage.vue'
import MultipleBuysPage from './pages/MultipleBuysPage.vue'
import PriceProfitPage from './pages/PriceProfitPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/price-profit',
    },
    {
      path: '/price-profit',
      name: 'price-profit',
      component: PriceProfitPage,
      meta: {
        title: 'Price & Profit',
      },
    },
    {
      path: '/buying-power',
      name: 'buying-power',
      component: BuyingPowerPage,
      meta: {
        title: 'Buying Power',
      },
    },
    {
      path: '/multiple-buys',
      name: 'multiple-buys',
      component: MultipleBuysPage,
      meta: {
        title: 'Multiple Buys',
      },
    },
  ],
})

router.afterEach((to) => {
  document.title = `PSE Stock Calc | ${String(to.meta.title ?? 'Calculator')}`
})

export default router
