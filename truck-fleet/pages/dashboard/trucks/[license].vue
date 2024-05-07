<script lang="ts" setup>
import type { DocumentData } from 'firebase/firestore';
import { GoogleMap } from 'vue3-google-map';
const config = useRuntimeConfig();
const licensePlate = computed(() => useRoute().params.license);
useSeoMeta({
  titleTemplate: `%s - ${licensePlate.value}`,
})

// CHANGE API KEY TO TRUCK FLEET PROJECT INSTEAD OF FLEET
const apiKey = config.public.google_maps;

console.log(apiKey)

const center = { lat: 42.501825, lng: 27.464184 };


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

    <GoogleMap :api-key="apiKey" style="height: 105vh;  border: 0px;" background-color="transparent" :center="center"
      :disable-default-ui="true" :zoom="13" :max-zoom="13.9" map-id="b514deccd04f2a38">
    </GoogleMap>

    <div
      class="backdrop-blur-lg z-10 h-24 w-[95%] mx-5 border border-primary/25 rounded-xl absolute bottom-5 shadow-md shadow-primary/50">
      <h1>{{ lastOrder?.licensePlate }}</h1>
    </div>
  </div>
</template>

<style lang="scss"></style>
