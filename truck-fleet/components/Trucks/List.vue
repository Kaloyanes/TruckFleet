<script lang="ts" setup>
// Get Trucks
const trucks = useTrucksStore();
trucks.init();
</script>

<template>
  <div class="flex flex-col gap-3 py-3">

    <div v-for="truck in trucks.trucks" class="relative">
      <NuxtLink :to="`/dashboard/trucks/${truck.licensePlate}`">
        <TrucksListRow :truck="truck" />
      </NuxtLink>
    </div>

  </div>
</template>

<style lang="scss"></style>
