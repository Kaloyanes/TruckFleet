<script lang="ts" setup>
const props = defineProps({
  truck: { type: Object, required: true }
})

const isTruckSelected = computed(() => {
  return useRoute().path.includes(props.truck.licensePlate)
})
</script>

<template>
  <div
    class="p-2 border border-neutral-500 bg-neutral-800 flex items-center transition-all duration-500 hover:bg-neutral-700 shadow-neutral-800/50 hover:shadow-neutral-700/50 active:scale-100 active:translate-y-0.5 shadow-[0_0_25px_rgba(0,0,0,0.10)] hover:shadow-[0_0_25px_rgba(0,0,0,0.10)] active:shadow-[0_0_15px_rgba(0,0,0,0.10)] justify-between rounded-[28px] px-4 "
    :class="{ 'bg-primary/25 border-primary shadow-primary/40': isTruckSelected }">

    <div class="flex flex-col items-start">
      <h1>{{ truck.licensePlate }}</h1>
      <h1 class="text-sm text-gray-400">{{ truck.model }}</h1>
    </div>
    <h1 class="text-sm text-gray-400">{{ truck.year }}</h1>
  </div>
</template>

<style lang="scss"></style>
