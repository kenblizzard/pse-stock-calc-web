import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useCalculatorLinks() {
  const router = useRouter()

  const tabs = computed(() => [
    { label: 'Price & Profit', to: { name: 'price-profit' } },
    { label: 'Buying Power', to: { name: 'buying-power' } },
    { label: 'Multiple Buys', to: { name: 'multiple-buys' } },
  ])

  function goToPriceProfit(prefill: Record<string, string | number>) {
    router.push({
      name: 'price-profit',
      query: Object.fromEntries(
        Object.entries(prefill).map(([key, value]) => [key, String(value)]),
      ),
    })
  }

  return {
    tabs,
    goToPriceProfit,
  }
}
