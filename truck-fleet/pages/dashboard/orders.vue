<script lang="ts" setup>
import { format } from 'date-fns';
useSeoMeta({
  titleTemplate: "%s - Orders"
})

definePageMeta({
  middleware: "order",
})


let currentDate = ref<Date>(new Date());

setInterval(() => {
  currentDate.value = new Date();
}, 1000);

async function openOrderAddDialog() {
  await navigateTo({ hash: "#addOrder" });
}

</script>

<template>
  <div class="flex w-full max-w-full my-2 mr-2 gap-6 flex-grow-0">
    <LazyOrderAddDialog />


    <div class="bg-[rgb(17,17,17)] flex-[1] flex flex-col rounded-xl ">

      <div class="p-6">

        <div class="flex justify-between items-center">
          <h1 class="font-bold text-3xl py-4 flex">
            {{ format(currentDate, "dd, MMMM | HH:mm:ss ") }}
            <div class="flex gap-3 items-end">
              <span class="text-sm">{{ format(currentDate, "EEEE") }}</span>
            </div>
          </h1>

          <Button @click="openOrderAddDialog">Add Order</Button>
        </div>


        <ScrollArea class="max-w-[66.5vw]">

          <OrderTruckTabs />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <UDivider class="py-5" />


      <div class="flex-[1] flex flex-grow-0 max-w-[66.5vw]">
        <div class="flex-[1] overflow-x-scroll">
          <NuxtPage />
        </div>
      </div>


    </div>

    <div class="flex flex-col flex-[0.4] gap-6">
      <div class="flex-[1] bg-[rgb(17,17,17)] rounded-xl p-6 relative overflow-hidden">
        <OrderSelected />
        <circle class="absolute w-[400px] h-[400px] blur-[125px] top-[40%] left-[30%] z-0 rounded-full bg-primary/35">
        </circle>
      </div>
      <div class="flex-[0.5] bg-[rgb(17,17,17)] rounded-xl">

      </div>
      <div class="flex-[0.4] flex gap-4 ">
        <div class="bg-[rgb(17,17,17)] rounded-xl flex-[0.7]">

        </div>
        <div class="bg-[rgb(17,17,17)] rounded-xl flex-[0.3]">

        </div>
      </div>
    </div>

  </div>
</template>
