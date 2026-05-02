<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useCalculatorLinks } from '../composables/useCalculatorLinks'
import AdSlot from './AdSlot.vue'

const route = useRoute()
const { tabs } = useCalculatorLinks()
</script>

<template>
  <div class="min-h-screen bg-transparent text-slate-900">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header class="rounded-3xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">PSE calculators</p>
              <h1 class="text-2xl font-bold tracking-tight text-slate-950">PSE Stock Calculator</h1>
            </div>
            <p class="max-w-lg text-sm text-slate-500">
              Lightweight, mobile-first calculators for price planning, buying power, and average entry analysis.
            </p>
          </div>

          <AdSlot label="Reserved top banner ad" />

          <nav class="grid gap-2 sm:grid-cols-3">
            <RouterLink
              v-for="tab in tabs"
              :key="tab.label"
              :to="tab.to"
              class="rounded-2xl px-4 py-3 text-center text-sm font-medium transition"
              :class="
                route.name === tab.to.name
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              "
            >
              {{ tab.label }}
            </RouterLink>
          </nav>
        </div>
      </header>

      <main class="flex-1 py-6">
        <slot />
      </main>

      <footer class="pb-4">
        <AdSlot label="Reserved footer ad space" />
      </footer>
    </div>
  </div>
</template>
