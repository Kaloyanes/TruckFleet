<script lang="ts" setup>
const truck = useState<any | null>("selectedTruck");
</script>

<template>
  <div>
    <h1>{{ truck?.licensePlate ?? "gkoakfg" }}</h1>
  </div>
</template>

<style lang="scss"></style>
