<script lang="ts" setup>

definePageMeta({
  layout: 'navigation',
  middleware: [
    'auth',
    'dashboard'
  ],
})
</script>

<template>
  <div class="flex pl-8 ">

    <DashboardNavigation />

    <div class="flex h-screen w-full">
      <NuxtPage />
    </div>
  </div>
</template>
