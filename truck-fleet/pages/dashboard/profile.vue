<script lang="ts" setup>
const route = useRoute()

const links = [{
  label: 'Profile',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  badge: 100,
  to: 'account'
}, {
  label: 'General',
  icon: 'i-heroicons-home',
  to: 'general'
}, {
  label: 'Horizontal Navigation',
  icon: 'i-heroicons-chart-bar',
  to: `${route.path.startsWith('/dev') ? '/dev' : ''}/components/horizontal-navigation`
}, {
  label: 'Command Palette',
  icon: 'i-heroicons-command-line',
  to: '/components/command-palette'
}]



</script>

<template>
  <div>
    <h1>Profile</h1>
    <UHorizontalNavigation :links="links" />
    <NuxtPage />
  </div>
</template>

<style lang="scss"></style>
