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

      <div class="flex-[1] bg-[rgb(17,17,17)] rounded-xl p-6 w-full relative overflow-hidden">
        <Button class="mb-2" @click="openTruckAddDialog">Add Truck</Button>

        <TrucksFilterChips />
        <TrucksList />

        <circle
          class="absolute w-[600px] h-[600px] blur-[125px] top-[70%] right-[30%] z-0 rounded-full bg-primary/35 transition-all">
        </circle>
      </div>

      <div class="flex-[0.5] bg-primary rounded-xl">
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
