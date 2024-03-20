<script lang="ts" setup>
useSeoMeta({
  titleTemplate: "%s - Orders"
})

if (useRoute().fullPath === "/dashboard/orders") {
  navigateTo("/dashboard/orders/all")
}
</script>

<template>
  <div>
    <div class="sticky top-0 z-20 rounded-b-xl">

      <h1 class="text-center text-3xl py-4">Orders</h1>

      <div class="flex p-2">
        <LazyAddOrder />
      </div>

    </div>

    <UDivider class="py-5" />
    <LazyOrderTruckTabs />

    <NuxtPage />
  </div>
</template>
