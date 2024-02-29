<template>
  <ClientOnly>
    <NuxtLayout :data-theme="isDark ? 'forest' : 'light'">
      <NuxtPage :data-theme="isDark ? 'forest' : 'light'" class="h-screen" />
    </NuxtLayout>
  </ClientOnly>
</template>


<script setup lang="ts">

const isDark = useDark({
  selector: 'html, body',
  attribute: 'data-theme',
  valueDark: 'forest',
  valueLight: 'light',
});

useSeoMeta({
  title: "Truck Fleet",
  description: "Truck Fleet is a fleet management system that allows you to manage",
  applicationName: "Truck Fleet",
})





</script>

<script lang="ts">

</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
}
</style>
