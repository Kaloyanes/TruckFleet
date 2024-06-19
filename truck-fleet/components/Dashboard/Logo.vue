<script lang="ts" setup></script>

<template>
  <div
    class="pb-5"
    @click="$router.push('/dashboard')"
    v-motion
    :initial="{
      rotate: 90,
      scale: 0,
      opacity: 0.5,
      'transform-origin': 'center center',
    }"
    :enter="{
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        duration: 500,
      },
    }"
  >
    <NuxtImg
      src="/favicon.svg"
      class="w-12 h-12 rounded-full p-2 bg-gradient-to-br from-blue-300 to-primary duration-300 ease infinite cursor-pointer"
      :class="{
        'bg-gradient-to-tl cursor-auto':
          $route.fullPath.includes('/dashboard/home'),
      }"
    />
  </div>
</template>

<style lang="scss"></style>
