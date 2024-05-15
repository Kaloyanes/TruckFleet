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

    <div class="flex flex-[1] h-screen w-full" v-motion :initial="{
      y: 0,
      opacity: 0,
      x: -100,
    }" :enter="{
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 500,
        delay: 150,
      },
    }">
      <NuxtPage />
    </div>
  </div>
</template>
