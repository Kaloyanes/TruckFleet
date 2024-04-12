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

</script>

<template>
  <div>
    <OrderAddDialog />
    <h1 class="font-bold text-3xl py-4 flex gap-x-2">
      {{ format(currentDate, "dd, MMMM | HH:mm:ss ") }}
      <div class="flex gap-x-3 items-end">
        <span class="text-sm">{{ format(currentDate, "EEEE") }}</span>
      </div>
    </h1>

    <!-- <UDivider class="py-5" /> -->

    <NuxtPage />
  </div>
</template>
