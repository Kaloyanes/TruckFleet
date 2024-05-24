<script lang="ts" setup>
import { computed } from 'vue';

const route = useRoute();
const licensePlate = computed(() => route.params.license);
</script>

<template>
  <div>
    <OrderList :license-plate="(licensePlate as string)" />
  </div>
</template>
