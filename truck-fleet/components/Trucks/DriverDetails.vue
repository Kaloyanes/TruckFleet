<script lang="ts" setup>
const props = defineProps({
  driver: {
    required: true,
    type: Object,
  },
});

const driverStore = useMyDriversStore();
const { license } = useRoute().params;
</script>

<template>
  <div
    class="backdrop-blur-lg z-10 bg-neutral-900/15 border border-primary/25 rounded-3xl shadow-[0_0_5px_rgba(0,0,0,0.3)] shadow-primary/50 flex flex-col items-center justify-center gap-2 p-6 w-full"
  >
    {{ props.driver.name }}
  </div>
</template>

<style lang="scss"></style>
