<script lang="ts" setup>
async function openTruckAddDialog() {
  await useRouter().push({ hash: '#addTruck' })
}

useSeoMeta({
  titleTemplate: "%s - Trucks"
})
</script>

<template>
  <div class="flex w-full max-w-full my-2 mr-2 gap-6">
    <div class="flex flex-col flex-[0.2] gap-6 ">

      <div class="flex-[1] bg-[rgb(17,17,17)] rounded-xl  w-full relative overflow-scroll  flex flex-col h-full">

        <div class="self-end p-3 mb-2 mx-2 sticky top-0 z-[50]">
          <Button @click="openTruckAddDialog">Add Truck</Button>
        </div>

        <div class="p-3 sticky top-12 z-[50] mx-2">
          <TrucksFilterChips />
        </div>


        <TrucksList />


      </div>

      <div class="flex-[0.5] bg-primary/50 rounded-xl">
        <TrucksSelected />
      </div>
    </div>

    <div class="bg-[rgb(17,17,17)] rounded-xl flex-[1] p-6 ">
      <LazyOrderAddDialog />
      <LazyCompanyAddDialog />
      <LazyTrucksAddDialog />

      <NuxtPage />
    </div>

  </div>
</template>
