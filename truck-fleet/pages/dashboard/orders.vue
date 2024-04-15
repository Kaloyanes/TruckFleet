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
  <div class="flex w-full max-w-full my-2 ml-5 mr-2 gap-4">
    <OrderAddDialog />
    <div class="bg-[rgb(17,17,17)] rounded-xl flex-[1] flex-grow-0 p-6">
      <div class="flex justify-between items-center">

        <h1 class="font-bold text-3xl py-4 flex gap-x-2">
          {{ format(currentDate, "dd, MMMM | HH:mm:ss ") }}
          <div class="flex gap-x-3 items-end">
            <span class="text-sm">{{ format(currentDate, "EEEE") }}</span>
          </div>
        </h1>

        <Button @click="openOrderAddDialog">Add Order</Button>
      </div>


      <ScrollArea class="w-[60vw]">

        <OrderTruckTabs />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <UDivider class="py-5" />

      <NuxtPage />
    </div>
    <div class="flex flex-col flex-[0.3] flex-grow gap-4">
      <div class="flex-[1] bg-[rgb(17,17,17)] rounded-xl">
        <OrderSelected />
      </div>
      <div class="flex-[0.5] bg-[rgb(17,17,17)] rounded-xl">

      </div>
      <div class="flex-[0.4] flex gap-4">
        <div class="bg-[rgb(17,17,17)] rounded-xl flex-[0.7]">

        </div>
        <div class="bg-[rgb(17,17,17)] rounded-xl flex-[0.3]">

        </div>
      </div>
    </div>

  </div>
</template>
