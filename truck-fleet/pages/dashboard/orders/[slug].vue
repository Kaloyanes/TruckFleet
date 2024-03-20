<script setup lang="ts">
let slug = useRoute().params.slug;

</script>

<template>
  <div>
    <LazyOrderTable :license-plate="slug as string" />
  </div>
</template>
