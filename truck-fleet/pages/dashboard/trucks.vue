<script lang="ts" setup>
async function openTruckAddDialog() {
  await useRouter().push({ hash: '#addTruck' })
}

useSeoMeta({
  titleTemplate: "%s - Trucks"
})



const searchInput = ref("");

const trucks = useTrucksStore();

watch(searchInput, (value) => {
  console.log(value);
  trucks.filterByLicensePlate(value);
})
</script>

<template>
  <div class="flex w-full max-w-full my-2 mr-2 gap-6">
    <div class="flex flex-col flex-[0.2] flex-grow-0 gap-6 ">

      <div class="flex-[1] bg-[rgb(17,17,17)] rounded-xl  w-full relative overflow-scroll  flex flex-col h-full px-4">

        <div class="self-end p-3 mb-1 mx-2 sticky top-1 z-[50] flex items-center w-full gap-2">
          <LazyTrucksSearch />

          <Button @click="openTruckAddDialog">Add Truck</Button>
        </div>

        <div class="p-3 sticky top-12 z-[50] mx-2">
          <LazyTrucksFilterChips />
        </div>


        <LazyTrucksList />


      </div>

      <div class="flex-[0.5] bg-primary/50 rounded-xl">
        <TrucksSelected />
      </div>
    </div>

    <LazyOrderAddDialog />
    <LazyCompanyAddDialog />
    <LazyTrucksAddDialog />

    <NuxtPage />


  </div>
</template>
