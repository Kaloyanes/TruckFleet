<script lang="ts" setup>
const searchInput = ref("");

let trucksStore = useTrucksStore();
// trucksStore.init();

watch(searchInput, (value) => {
  trucksStore.filterByLicensePlate(value);
})
</script>

<template>
  <Input placeholder="Search" class="flex-1 ml-4" v-model="searchInput" />
</template>

<style lang="scss"></style>
