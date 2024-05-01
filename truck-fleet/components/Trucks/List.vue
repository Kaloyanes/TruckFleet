<script lang="ts" setup>
// Get Trucks
const { trucks } = await useTrucks();


</script>

<template>
  <ScrollArea class="h-full scroll-m-2 mt-3 scroll">
    <div class="flex flex-col gap-3 z-[150]">

      <div v-for="truck in [...trucks, ...trucks, ...trucks, ...trucks, ...trucks]">
        <NuxtLink :to="`/dashboard/trucks/${truck.licensePlate}`">
          <div
            class="p-2 border border-neutral-500 bg-neutral-800 rounded-md flex items-center transition-all duration-500 hover:bg-neutral-700 shadow-neutral-800/50 hover:shadow-neutral-700/50 active:scale-100 active:translate-y-0.5 shadow-[0_0_25px_rgba(0,0,0,0.10)] hover:shadow-[0_0_25px_rgba(0,0,0,0.10)] active:shadow-[0_0_15px_rgba(0,0,0,0.10)] justify-between">

            <div class="flex flex-col items-start">
              <h1>{{ truck.licensePlate }}</h1>
              <h1 class="text-sm text-gray-400">{{ truck.model }}</h1>
            </div>

            <h1 class="text-sm">{{ truck.year }}</h1>
          </div>
        </NuxtLink>
      </div>
    </div>
  </ScrollArea>
</template>

<style lang="scss"></style>
