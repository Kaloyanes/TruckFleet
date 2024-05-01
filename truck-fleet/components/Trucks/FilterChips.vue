<script lang="ts" setup>
const filters = [
  "All",
  "In Loading",
  "On Route",
  "Delivered",
  "Damaged",
]

</script>

<template>
  <div class="flex justify-evenly gap-2">
    <div v-for="filter in filters" class="flex gap">
      <Button variant="outline">{{ filter }}</Button>
    </div>
  </div>
</template>

<style lang="scss"></style>
