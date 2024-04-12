<script lang="ts" setup>
definePageMeta({
  middleware: 'profile',
})

const route = useRoute()

const links = [{
  label: 'Profile',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  badge: 100,
  to: '/dashboard/profile/account'
}, {
  label: 'Settings',
  icon: 'i-heroicons-cog',
  to: '/dashboard/profile/general'
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
    <LazyUHorizontalNavigation :links="links" />
    <NuxtPage />
  </div>
</template>

<style lang="scss"></style>
