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
  <div>
    <NuxtPage />
  </div>
</template>
