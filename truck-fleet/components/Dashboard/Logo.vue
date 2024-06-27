<script lang="ts" setup></script>

<template>
  <Motion
    :initial="{
      rotate: 90,
      scale: 0,
      opacity: 0.5,
      filter: 'blur(15px)',
      transformOrigin: 'center',
    }"
    :animate="{
      opacity: 1,
      rotate: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        easing: spring({
          damping: 10,
          stiffness: 100,
          mass: 1,
        }),
      },
    }"
  >
    <div class="pb-5" @click="$router.push('/dashboard')" v-motion>
      <NuxtImg
        src="/favicon.svg"
        class="ease infinite h-12 w-12 cursor-pointer rounded-full bg-gradient-to-br from-blue-300 to-primary p-2 duration-300"
        :class="{
          'cursor-auto bg-gradient-to-tl':
            $route.fullPath.includes('/dashboard/home'),
        }"
      />
    </div>
  </Motion>
</template>

<style lang="scss"></style>
