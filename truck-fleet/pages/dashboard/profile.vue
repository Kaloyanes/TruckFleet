<script lang="ts" setup>
definePageMeta({
  middleware: "profile",
});

const route = useRoute();

const links = [
  {
    label: "Profile",
    avatar: {
      src: "https://avatars.githubusercontent.com/u/739984?v=4",
    },
    badge: 100,
    to: "/dashboard/profile/account",
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog",
    to: "/dashboard/profile/general",
  },
];

// TODO: Add this link if the user is an admin
if (true)
  links.push({
    label: "Workers",
    icon: "i-heroicons-user-group",
    to: "/dashboard/profile/workers",
  });
</script>

<template>
  <div>
    <LazyUHorizontalNavigation :links="links" />
    <NuxtPage />
  </div>
</template>

<style lang="scss"></style>
