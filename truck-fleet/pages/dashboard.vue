<script lang="ts" setup>
definePageMeta({
  layout: "navigation",
  middleware: ["auth"],
});
</script>

<template>
  <div class="flex pl-8 gap-5 overflow-hidden">
    <div class="flex-[0.01]">
      <DashboardNavigation />
    </div>

    <div
      class="flex flex-[1] h-screen w-full"
      v-motion
      :initial="{
        opacity: 0,
        scale: 0.8,
      }"
      :enter="{
        scale: 1,
        opacity: 1,
        transition: {
          delay: 150,
          type: 'spring',
          duration: 600,
        },
      }"
    >
      <NuxtPage />
    </div>
  </div>
</template>
