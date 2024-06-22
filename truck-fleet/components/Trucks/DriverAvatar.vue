<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  driverName: {
    required: true,
    type: String,
  },
  driverUrl: {
    type: String,
  },
});

const formattedDriverName = computed(() => {
  // Get the first letter of the first and last name
  return props.driverName
    .split(" ")
    .map((name) => name[0])
    .join("");
});
</script>

<template>
  <Avatar class="rounded-xl" :class="$attrs.class">
    <AvatarImage :src="props.driverUrl ?? ''" :alt="{ driverName }" />
    <AvatarFallback>{{ formattedDriverName }}</AvatarFallback>
  </Avatar>
</template>

<style lang="scss"></style>
