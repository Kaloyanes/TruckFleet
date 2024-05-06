<script lang="ts" setup>
const route = useRoute();
const licensePlate = computed(() => route.params.licensePlate);
</script>

<template>
  <div>
    <OrderList :license-plate="(licensePlate as string)" />
  </div>
</template>
