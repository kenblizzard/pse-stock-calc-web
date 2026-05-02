<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import ResultRow from '../components/ResultRow.vue'
import { calculateAggregatePosition, calculateTransactionTotal, createBuyEntry, type BuyEntry } from '../domain/trading'
import { useCalculatorLinks } from '../composables/useCalculatorLinks'
import { formatInteger, formatMoney, formatPrice } from '../utils/numberFormat'

interface BuyEntryForm extends BuyEntry {
  sharesInput: string
  buyPriceInput: string
}

const { goToPriceProfit } = useCalculatorLinks()

const entries = ref<BuyEntryForm[]>([
  {
    ...createBuyEntry(),
    sharesInput: '',
    buyPriceInput: '',
  },
])

const parsedEntries = computed(() =>
  entries.value.map((entry) => ({
    ...entry,
    shares: Number(entry.sharesInput),
    buyPrice: Number(entry.buyPriceInput),
  })),
)

const aggregate = computed(() => calculateAggregatePosition(parsedEntries.value))

function addEntry() {
  if (entries.value.length >= 5) {
    return
  }

  entries.value.push({
    ...createBuyEntry(),
    sharesInput: '',
    buyPriceInput: '',
  })
}

function removeEntry(id: string) {
  if (entries.value.length === 1) {
    entries.value[0].sharesInput = ''
    entries.value[0].buyPriceInput = ''
    return
  }

  entries.value = entries.value.filter((entry) => entry.id !== id)
}

function totalForEntry(entry: BuyEntryForm): number {
  const shares = Number(entry.sharesInput)
  const buyPrice = Number(entry.buyPriceInput)

  if (!Number.isFinite(shares) || shares <= 0 || !Number.isFinite(buyPrice) || buyPrice <= 0) {
    return 0
  }

  return calculateTransactionTotal(buyPrice, shares, 'buy')
}

function goToProfitAnalysis() {
  if (aggregate.value.totalShares <= 0) {
    return
  }

  goToPriceProfit({
    shares: aggregate.value.totalShares,
    buyPrice: aggregate.value.averagePrice,
    sellPrice: aggregate.value.averagePrice,
  })
}
</script>

<template>
  <section class="space-y-6">
    <PageHeader
      title="Multiple Buys"
      description="Track up to five buy entries, include fees in each total cost, and compute the combined weighted average entry price."
    />

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section class="space-y-4 rounded-3xl border border-white/80 bg-white p-5 shadow-sm">
        <div
          v-for="(entry, index) in entries"
          :key="entry.id"
          class="space-y-4 rounded-2xl border border-slate-200 p-4"
        >
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-base font-semibold text-slate-900">Buy {{ index + 1 }}</h2>
            <button
              class="text-sm font-medium text-rose-600 transition hover:text-rose-700"
              @click="removeEntry(entry.id)"
            >
              Remove
            </button>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-2 text-sm text-slate-600">
              <span class="font-medium text-slate-700">Shares</span>
              <input
                v-model="entry.sharesInput"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
                inputmode="numeric"
                type="number"
                min="0"
                step="1"
              />
            </label>

            <label class="space-y-2 text-sm text-slate-600">
              <span class="font-medium text-slate-700">Buy price</span>
              <input
                v-model="entry.buyPriceInput"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
                inputmode="decimal"
                type="number"
                min="0"
                step="0.0001"
              />
            </label>
          </div>

          <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Entry total amount: <strong class="text-slate-950">₱{{ formatMoney(totalForEntry(entry)) }}</strong>
          </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <button
            class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="entries.length >= 5"
            @click="addEntry"
          >
            Add buy entry
          </button>

          <button
            class="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            :disabled="aggregate.totalShares <= 0"
            @click="goToProfitAnalysis"
          >
            Open in Price & Profit
          </button>
        </div>
      </section>

      <section class="rounded-3xl border border-white/80 bg-white p-5 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-slate-950">Combined position</h2>
        <dl>
          <ResultRow label="Total shares" :value="formatInteger(aggregate.totalShares)" />
          <ResultRow label="Total amount" :value="`₱${formatMoney(aggregate.totalAmount)}`" />
          <ResultRow label="Weighted average" :value="`₱${formatPrice(aggregate.averagePrice)}`" />
        </dl>
      </section>
    </div>
  </section>
</template>
