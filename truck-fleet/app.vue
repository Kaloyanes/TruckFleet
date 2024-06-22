<script lang="ts" setup>
useSeoMeta({
  title: "Truck Fleet",
  description: "Truck Fleet",
});
</script>

<template>
  <UNotifications />

  <NuxtLoadingIndicator color="primary" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(2rem);
}

.page-enter-from {
  transform: scale(0.75) translateY(100px);
}

.page-leave-to {
  transform: scale(0.75) translateY(-100px);
}
</style>
