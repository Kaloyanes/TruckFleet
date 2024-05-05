<script lang="ts" setup>

const filters = [
  "All",
  "In Loading",
  "On Route",
  "Delivered",
  "Damaged",
]

let trucksStore = useTrucksStore();
// trucksStore.init();

function onFilter(filter: string) {
  trucksStore.filter(filter);
}

</script>

<template>
  <div class="flex justify-evenly gap-2">
    <div v-for="filter in filters" class="flex gap">
      <Button class="rounded-full" variant="outline" @click="onFilter(filter)">{{ filter }}</Button>
    </div>
  </div>
</template>

<style lang="scss"></style>
