<script setup lang="ts">
let slug = useRoute().params.slug;

</script>

<template>
  <div>
    <OrderTable :license-plate="slug as string" />
  </div>
</template>
