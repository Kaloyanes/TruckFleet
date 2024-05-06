<script lang="ts" setup>

const licensePlate = computed(() => useRoute().params.license);
</script>

<template>
  <div>
    {{ licensePlate }}
  </div>
</template>

<style lang="scss"></style>
