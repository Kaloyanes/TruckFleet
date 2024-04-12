<script lang="ts" setup>
import { format } from 'date-fns';
useSeoMeta({
  titleTemplate: "%s - Orders"
})

definePageMeta({
  middleware: "order",
})

</script>

<template>
  <div>
    <OrderAddDialog />
    <h1 class="font-bold text-3xl py-4">{{ format(new Date(), "dd, MMMM") }}</h1>

    <!-- <UDivider class="py-5" /> -->

    <NuxtPage />
  </div>
</template>
