<script lang="ts" setup>
import type { DocumentData } from 'firebase/firestore';

const licensePlate = computed(() => useRoute().params.license);

useSeoMeta({
  titleTemplate: `%s - ${licensePlate.value}`,
})

const config = useRuntimeConfig();

// TODO: CHANGE API KEY TO TRUCK FLEET PROJECT INSTEAD OF FLEET
const apiKey = config.public.google_maps;

const orders = useOrdersStore();

await orders.init();
orders.filterByLicensePlate(licensePlate.value as string);

const lastOrder = ref<DocumentData | null>(null);

if (orders.companyOrders.length) {
  lastOrder.value = orders.companyOrders.sort((a, b) => b.createdAt - a.createdAt)[0];
}
</script>

<template>
  <div class="overflow-hidden min-w-0 w-full rounded-xl relative">

    <LazyTrucksMap :api-key="apiKey" :last-order="lastOrder" />

    <div
      class="backdrop-blur-lg z-10 h-24 w-[95%] mx-5 border border-primary/25 rounded-xl absolute bottom-5 shadow-[0_0_15px_rgba(0,0,0,0.3)] shadow-primary/50">
      <h1>{{ lastOrder?.licensePlate }}</h1>
    </div>
  </div>
</template>

<style lang="scss"></style>
