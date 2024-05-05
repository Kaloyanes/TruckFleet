<script lang="ts" setup>
const truck = computed(() => useRoute().path.split('/')[3]);

console.log();
</script>

<template>
  <div>
    <h1>{{ truck ?? "gkoakfg" }}</h1>
  </div>
</template>

<style lang="scss"></style>
