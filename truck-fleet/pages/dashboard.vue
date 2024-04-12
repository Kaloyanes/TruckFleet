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

    <div class="bg-[rgb(15,15,15)] my-2 ml-5 mr-2 rounded-xl w-full p-6">
      <NuxtPage />
    </div>
  </div>
</template>
