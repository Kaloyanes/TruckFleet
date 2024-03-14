<script lang="ts" setup>
useSeoMeta({
  titleTemplate: "%s - Orders"
})


</script>

<template>
  <div>
    <div class="sticky top-0  bg-zinc-300 dark:bg-zinc-900 z-20 rounded-b-xl">

      <h1 class="text-center text-3xl py-4">Orders</h1>

      <div class="flex p-2">
        <AddOrder />
      </div>

    </div>

    <UDivider class="py-5" />

    <div class="overflow-x-scroll flex-1 max-w-[83.3vw]  ">

      <OrderTable />
    </div>
  </div>
</template>
