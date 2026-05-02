<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import ResultRow from '../components/ResultRow.vue'
import { calculatePriceProfitSummary } from '../domain/trading'
import { formatFixed, formatInteger, formatMoney, formatPercent, formatPrice } from '../utils/numberFormat'
import { readOptionalNumberQuery } from '../utils/query'

const route = useRoute()

const shareCount = ref('')
const buyPrice = ref('')
const sellPrice = ref('')
const gainPercent = ref(0)

function syncFromQuery() {
  const nextShares = readOptionalNumberQuery(route.query.shares)
  const nextBuyPrice = readOptionalNumberQuery(route.query.buyPrice)
  const nextSellPrice = readOptionalNumberQuery(route.query.sellPrice)

  shareCount.value = nextShares ? String(nextShares) : ''
  buyPrice.value = nextBuyPrice ? String(nextBuyPrice) : ''
  sellPrice.value = nextSellPrice ? String(nextSellPrice) : ''
}

watch(() => route.fullPath, syncFromQuery, { immediate: true })

const parsedShares = computed(() => Number(shareCount.value))
const parsedBuyPrice = computed(() => Number(buyPrice.value))
const parsedSellPrice = computed(() => Number(sellPrice.value))

const hasValidInputs = computed(
  () =>
    Number.isFinite(parsedShares.value) &&
    parsedShares.value > 0 &&
    Number.isFinite(parsedBuyPrice.value) &&
    parsedBuyPrice.value > 0 &&
    Number.isFinite(parsedSellPrice.value) &&
    parsedSellPrice.value > 0,
)

const summary = computed(() => {
  if (!hasValidInputs.value) {
    return null
  }

  return calculatePriceProfitSummary(parsedShares.value, parsedBuyPrice.value, parsedSellPrice.value)
})

function updateSellPriceFromGain() {
  if (!Number.isFinite(parsedBuyPrice.value) || parsedBuyPrice.value <= 0) {
    return
  }

  const nextSellPrice = parsedBuyPrice.value + parsedBuyPrice.value * (gainPercent.value / 100)
  sellPrice.value = formatFixed(nextSellPrice, 4)
}
</script>

<template>
  <section class="space-y-6">
    <PageHeader
      title="Price & Profit"
      description="Estimate buy-side fees, sell-side proceeds, break-even price, and both broker-style and all-in profit/loss from a single stock position."
    />

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section class="space-y-5 rounded-3xl border border-white/80 bg-white p-5 shadow-sm">
        <div class="grid gap-4 sm:grid-cols-3">
          <label class="space-y-2 text-sm text-slate-600">
            <span class="font-medium text-slate-700">Number of shares</span>
            <input
              v-model="shareCount"
              data-testid="price-profit-shares"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              inputmode="numeric"
              placeholder="0"
              type="number"
              min="0"
            />
          </label>

          <label class="space-y-2 text-sm text-slate-600">
            <span class="font-medium text-slate-700">Buy price</span>
            <input
              v-model="buyPrice"
              data-testid="price-profit-buy-price"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              inputmode="decimal"
              placeholder="0.0000"
              type="number"
              min="0"
              step="0.0001"
            />
          </label>

          <label class="space-y-2 text-sm text-slate-600">
            <span class="font-medium text-slate-700">Sell price</span>
            <input
              v-model="sellPrice"
              data-testid="price-profit-sell-price"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              inputmode="decimal"
              placeholder="0.0000"
              type="number"
              min="0"
              step="0.0001"
            />
          </label>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <div class="mb-3 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-slate-700">Quick sell target</p>
              <p class="text-xs text-slate-500">Adjust the sell price using a simple gain/loss percentage.</p>
            </div>
            <strong class="text-sm text-slate-900">{{ gainPercent }}%</strong>
          </div>

          <input
            v-model="gainPercent"
            class="w-full accent-sky-600"
            type="range"
            min="-50"
            max="150"
            step="1"
            @input="updateSellPriceFromGain"
          />
        </div>

        <p v-if="!summary" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          Enter a valid share count, buy price, and sell price to see your totals.
        </p>

        <div v-else class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-2xl bg-emerald-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Buy side</p>
            <p class="mt-2 text-2xl font-bold text-emerald-950">₱{{ formatMoney(summary.buyTotalAmount) }}</p>
            <p class="mt-1 text-sm text-emerald-700">Fees: ₱{{ formatMoney(summary.buyFees.totalFee) }}</p>
          </div>

          <div class="rounded-2xl bg-sky-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Sell side</p>
            <p class="mt-2 text-2xl font-bold text-sky-950">₱{{ formatMoney(summary.sellTotalAmount) }}</p>
            <p class="mt-1 text-sm text-sky-700">Fees: ₱{{ formatMoney(summary.sellFees.totalFee) }}</p>
          </div>
        </div>
      </section>

      <section class="space-y-4 rounded-3xl border border-white/80 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-950">Trade summary</h2>
        <dl>
          <ResultRow label="Shares" :value="summary ? formatInteger(parsedShares) : '0'" />
          <ResultRow label="Average price per share" :value="summary ? `₱${formatPrice(summary.averagePricePerShare)}` : '₱0.0000'" />
          <ResultRow label="Break-even sell price" :value="summary ? `₱${formatPrice(summary.breakEvenPrice)}` : '₱0.0000'" />
          <ResultRow
            label="Broker gain/loss"
            :value="summary ? `₱${formatMoney(summary.brokerProfit)} (${formatPercent(summary.brokerProfitPercent)})` : '₱0.00 (0.00%)'"
            :tone="summary ? (summary.brokerProfit >= 0 ? 'success' : 'danger') : 'default'"
          />
          <ResultRow
            label="Overall gain/loss"
            :value="summary ? `₱${formatMoney(summary.overallProfit)} (${formatPercent(summary.overallProfitPercent)})` : '₱0.00 (0.00%)'"
            :tone="summary ? (summary.overallProfit >= 0 ? 'success' : 'danger') : 'default'"
          />
        </dl>
      </section>
    </div>
  </section>
</template>
