<script lang="ts" setup>
const licensePlate = computed(() => useRoute().params.license);

useSeoMeta({
  titleTemplate: `%s - ${licensePlate.value}`,
});

const config = useRuntimeConfig();

// TODO: CHANGE API KEY TO TRUCK FLEET PROJECT INSTEAD OF FLEET
const apiKey = config.public.google_maps;

const trucksStore = await useTrucksStore();
const invalidLicensePlate = computed(() => {
  const res = !trucksStore.trucks.some(
    (truck) => truck.licensePlate === useRoute().params.license,
  );

  return res;
});

onMounted(() => {
  if (invalidLicensePlate.value) {
    useRouter().replace("/dashboard/trucks");
  }
});

// watch(invalidLicensePlate, async (value) => {
//   if (value) {
//     await useRouter().replace('/dashboard/trucks')
//   }
// })

const orders = useOrdersStore();

orders.filterByLicensePlate(licensePlate.value as string);

const lastOrder = computed(() => {
  const sortedOrders = orders.companyOrders.sort(
    (a, b) => b.createdAt - a.createdAt,
  );
  return sortedOrders.length ? sortedOrders[0] : null;
});

function addOrder() {
  navigateTo(`/dashboard/orders/${licensePlate.value}#addOrder`);
}

async function goBackToTrucks() {
  await useRouter().replace("/dashboard/trucks");
}
</script>

<template>
  <div class="overflow-hidden min-w-0 w-full rounded-xl relative">
    <LazyTrucksMap v-if="lastOrder" :api-key="apiKey" :last-order="lastOrder" />

    <div
      v-else
      class="w-full h-full flex flex-col gap-2 justify-center items-center bg-[rgb(17,17,17)]"
    >
      <h1>No orders found</h1>
      <Button variant="outline" @click="addOrder">Add Order</Button>
    </div>

    <div
      v-if="lastOrder"
      class="flex flex-row-reverse gap-2 w-full absolute bottom-0 p-2"
    >
      <LazyTrucksDetails :order="lastOrder" class="flex-[1]" />

      <LazyTrucksDriverDetails class="flex-[0.3]" />
    </div>
  </div>
</template>

<style lang="scss"></style>
