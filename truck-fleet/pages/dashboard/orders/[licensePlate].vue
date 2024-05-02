<script lang="ts" setup>


const route = useRoute();


const licensePlate = computed(() => route.params.licensePlate);


</script>

<template>
  <OrderList :license-plate="(licensePlate as string)" />
</template>
