<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
})

function goBack() {
  useRouter().back();
}
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen gap-3">
    <h1 class="text-9xl">{{ error?.statusCode }}</h1>
    <h1>{{ error?.message }}</h1>

    <Button class="text-xl" @click="goBack">
      Go back home
    </Button>
  </div>
</template>
