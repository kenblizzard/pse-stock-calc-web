<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <header class="space-y-3">
    <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">PSE calculators</p>
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{{ title }}</h1>
      <p class="max-w-2xl text-sm text-slate-600 sm:text-base">{{ description }}</p>
    </div>
  </header>
</template>
