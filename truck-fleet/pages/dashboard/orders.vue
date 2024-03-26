<script lang="ts" setup>
useSeoMeta({
  titleTemplate: "%s - Orders"

})

definePageMeta({
  middleware: "order",
})

const qs = computed(() => {
  let quer = useRoute().query;
  console.log(quer)
  if (quer.addOrder) {
    let addOrder = useState('addOrder');

  }
})

</script>

<template>
  <div>
    {{ qs }}
    <div class="sticky top-0 z-20 rounded-b-xl dark:bg-cod-gray-950/30 bg-opacity-50 backdrop-blur-md">

      <h1 class="text-center text-3xl py-4">Orders</h1>

      <div class="flex p-2">
        <AddOrder />
        <CompanyAddDialog />
      </div>

      <!-- <UDivider class="py-5" /> -->
      <OrderTruckTabs />
    </div>


    <NuxtPage />
  </div>
</template>
