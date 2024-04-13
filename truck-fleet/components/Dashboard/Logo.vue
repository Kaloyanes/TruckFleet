<script lang="ts" setup>

</script>

<template>
  <div class="pb-5" @click="$router.push('/dashboard')">
    <NuxtImg src="/favicon.svg"
      class="w-12 h-12 rounded-full p-2 bg-gradient-to-br from-blue-300 to-primary duration-300 ease infinite cursor-pointer"
      :class="{ 'bg-gradient-to-tl cursor-auto': $route.fullPath.includes('/dashboard/home') }" />
  </div>
</template>

<style lang="scss"></style>
