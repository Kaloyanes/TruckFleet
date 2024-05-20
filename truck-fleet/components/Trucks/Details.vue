<script lang="ts" setup>
const props = defineProps({
  order: {
    required: true,
  }
})
</script>

<template>
  <div
    class="backdrop-blur-lg z-10 h-24 bg-neutral-900/35  border border-primary/25 rounded-3xl shadow-[0_0_5px_rgba(0,0,0,0.3)] shadow-primary/50">
    <h1>{{ "Load" }}</h1>
  </div>
</template>

<style lang="scss"></style>
