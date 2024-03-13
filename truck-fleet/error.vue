<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen gap-3">
    <h1 class="text-9xl">{{ error?.statusCode }}</h1>
    <h1>{{ error?.message }}</h1>
    <NuxtLink to="/">
      <UButton class="text-xl">
        Go back home
      </UButton>
    </NuxtLink>
  </div>
</template>
