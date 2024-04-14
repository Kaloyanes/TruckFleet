<script lang="ts" setup>

const props = defineProps({
  licensePlate: {
    type: String,
    required: true
  }
})

const orders = await useOrders(props.licensePlate);

console.log(orders.value);
</script>

<template>
  <div>
    {{ props.licensePlate }}
  </div>
</template>

<style lang="scss"></style>
