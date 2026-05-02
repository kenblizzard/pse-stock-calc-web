<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <aside
    class="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-center text-xs tracking-[0.22em] text-slate-400 uppercase"
  >
    {{ label ?? 'Ad space' }}
  </aside>
</template>
