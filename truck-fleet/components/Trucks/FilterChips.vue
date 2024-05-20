<script lang="ts" setup>

const filters = [
  "All",
  "Available",
  "In Loading",
  "On Route",
  "Delivered",
  "Damaged",
]

let trucksStore = useTrucksStore();
// trucksStore.init();

function onFilter(filter: string) {
  trucksStore.filterByStatus(filter);
}

</script>

<template>
  <div class="flex justify-evenly gap-2 transition-all">
    <div v-for="filter in  filters " class="flex">
      <Button class="rounded-full relative transition-all"
        :class="{ 'currentFilter': trucksStore.currentFilter == filter }" variant="outline" @click="onFilter(filter)">
        {{ filter }}
      </Button>
    </div>
  </div>
</template>

<style lang="scss">
.currentFilter {
  @apply bg-primary-600 text-white hover:bg-primary-800 shadow-primary/50 hover:shadow-primary-800/75 border-primary-400;
}
</style>
