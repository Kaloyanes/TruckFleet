<script lang="ts" setup>
useSeoMeta({
  titleTemplate: "%s - Orders"

})

definePageMeta({
  middleware: "order",
})


</script>

<template>
  <div>

    <div class="sticky top-0 z-20 rounded-b-xl dark:bg-cod-gray-950">

      <h1 class="text-center text-3xl py-4">Orders</h1>

      <div class="flex p-2">
        <AddOrder />
      </div>

      <!-- <UDivider class="py-5" /> -->
      <LazyOrderTruckTabs />
    </div>


    <NuxtPage />
  </div>
</template>
