<script setup lang="ts">
defineProps<{
  label: string
  value: string
  tone?: 'default' | 'success' | 'danger'
}>()
</script>

<template>
  <div class="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
    <dt class="text-sm text-slate-500">{{ label }}</dt>
    <dd
      class="text-right text-sm font-semibold"
      :class="{
        'text-slate-900': !tone || tone === 'default',
        'text-emerald-600': tone === 'success',
        'text-rose-600': tone === 'danger',
      }"
    >
      {{ value }}
    </dd>
  </div>
</template>
