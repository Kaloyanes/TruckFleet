<script lang="ts" setup>

useSeoMeta({
  title: 'Truck Fleet',
  description: 'Truck Fleet',
})


</script>


<template>
  <NuxtLoadingIndicator color="primary" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />

</template>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;

}

.page-enter-from,
.page-leave-to {
  opacity: 0.1;
  transform: scale(0.8);
  filter: blur(0.5rem);
}
</style>
