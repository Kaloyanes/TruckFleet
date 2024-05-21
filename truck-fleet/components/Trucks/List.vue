<script lang="ts" setup>
// Get Trucks
const trucksStore = useTrucksStore();
</script>

<template>
  <div class="flex flex-col gap-3 py-3">

    <p class="text-sm text-gray-600">Tip: Right click on a truck</p>
    <div v-for="truck in trucksStore.trucks" class="relative">
      <NuxtLink :to="`/dashboard/trucks/${truck.licensePlate}`">
        <TrucksListRow :truck="truck" />
      </NuxtLink>
    </div>

  </div>
</template>

<style lang="scss"></style>
