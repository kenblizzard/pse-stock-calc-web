<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import ResultRow from '../components/ResultRow.vue'
import { calculateBudgetPlan } from '../domain/trading'
import { useCalculatorLinks } from '../composables/useCalculatorLinks'
import { formatInteger, formatMoney, formatPrice } from '../utils/numberFormat'

const { goToPriceProfit } = useCalculatorLinks()

const buyingPower = ref('')
const buyPrice = ref('')

const parsedBuyingPower = computed(() => Number(buyingPower.value))
const parsedBuyPrice = computed(() => Number(buyPrice.value))

const plan = computed(() => {
  if (
    !Number.isFinite(parsedBuyingPower.value) ||
    parsedBuyingPower.value <= 0 ||
    !Number.isFinite(parsedBuyPrice.value) ||
    parsedBuyPrice.value <= 0
  ) {
    return null
  }

  return calculateBudgetPlan(parsedBuyingPower.value, parsedBuyPrice.value)
})

function goToProfitAnalysis() {
  if (!plan.value || plan.value.shareCount <= 0) {
    return
  }

  goToPriceProfit({
    shares: plan.value.shareCount,
    buyPrice: parsedBuyPrice.value,
    sellPrice: plan.value.breakEvenPrice,
  })
}
</script>

<template>
  <section class="space-y-6">
    <PageHeader
      title="Buying Power"
      description="Find the largest board-lot-compliant purchase your budget can support, including fees, break-even pricing, and remaining cash."
    />

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section class="space-y-5 rounded-3xl border border-white/80 bg-white p-5 shadow-sm">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="space-y-2 text-sm text-slate-600">
            <span class="font-medium text-slate-700">Buying power</span>
            <input
              v-model="buyingPower"
              data-testid="buying-power-budget"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              type="number"
              inputmode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </label>

          <label class="space-y-2 text-sm text-slate-600">
            <span class="font-medium text-slate-700">Buy price</span>
            <input
              v-model="buyPrice"
              data-testid="buying-power-price"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              type="number"
              inputmode="decimal"
              min="0"
              step="0.0001"
              placeholder="0.0000"
            />
          </label>
        </div>

        <div v-if="plan" class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Purchasable shares</p>
            <p class="mt-2 text-2xl font-bold text-slate-950">{{ formatInteger(plan.shareCount) }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Board lot</p>
            <p class="mt-2 text-2xl font-bold text-slate-950">{{ formatInteger(plan.boardLot) }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Break-even</p>
            <p class="mt-2 text-2xl font-bold text-slate-950">₱{{ formatPrice(plan.breakEvenPrice) }}</p>
          </div>
        </div>

        <button
          class="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          :disabled="!plan || plan.shareCount <= 0"
          @click="goToProfitAnalysis"
        >
          Open in Price & Profit
        </button>
      </section>

      <section class="rounded-3xl border border-white/80 bg-white p-5 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-slate-950">Budget summary</h2>
        <p
          v-if="!plan"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500"
        >
          Enter a budget and stock price to estimate a valid purchase plan.
        </p>
        <dl v-else>
          <ResultRow label="Average price per share" :value="`₱${formatPrice(plan.averagePricePerShare)}`" />
          <ResultRow label="Total fees" :value="`₱${formatMoney(plan.totalFees)}`" />
          <ResultRow label="Total amount" :value="`₱${formatMoney(plan.totalAmount)}`" />
          <ResultRow label="Remaining buying power" :value="`₱${formatMoney(plan.remainingBuyingPower)}`" />
        </dl>
      </section>
    </div>
  </section>
</template>
