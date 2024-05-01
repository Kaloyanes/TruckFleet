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
  <div class="flex pl-8 gap-5">

    <div class="flex-[0.01]">
      <DashboardNavigation />
    </div>

    <div class="flex flex-[1] h-screen w-full">
      <NuxtPage />
    </div>
  </div>
</template>
