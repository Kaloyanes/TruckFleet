<script lang="ts" setup>
let user = useCurrentUser();
let db = useFirestore();

const { data: profile, promise: profilePromise } = useProfileDoc();

let profilePicture = computed(
  () => profile?.value?.profilePicture || undefined,
);

const links = [
  {
    title: "Chats",
    href: "/dashboard/chats",
    icon: "i-material-symbols-chat",
  },
  {
    title: "Home",
    href: "/dashboard/home",
    icon: "i-material-symbols-home-outline-rounded",
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: "i-material-symbols-receipt",
  },
  {
    title: "Trucks",
    href: "/dashboard/trucks",
    icon: "i-heroicons-truck",
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: "i-material-symbols-home-work-outline-rounded",
  },
];

const endLinks = [
  {
    title: "Logout",
    href: "/logout",
    icon: "i-material-symbols-logout-rounded",
  },
];

const profileLink = {
  title: "Profile",
  href: "/dashboard/profile/account",
  icon: "i-heroicons-user-circle",
};
</script>

<template>
  <div class="h-screen py-5 flex flex-col gap-5 items-center">
    <DashboardLogo />
    <div class="flex-1" />

    <DashboardItem
      v-for="(link, index) in links"
      :link="link"
      :exact-type="false"
      :delayMs="index * 100"
    />
    <div class="flex-1" />

    <div>
      <DashboardItem
        :link="{
          title: profile?.name,
          href: '/dashboard/profile',
        }"
        v-if="profilePicture"
        :delayMs="links.length * 100"
      >
        <template #icon>
          <Avatar class="w-6 h-6">
            <AvatarImage :src="profilePicture" alt="Profile Picture" />
          </Avatar>
        </template>
      </DashboardItem>
      <DashboardItem v-else :link="profileLink" />
    </div>
    <DashboardItem v-for="(link, index) in endLinks" :link="link" />
  </div>
</template>

<style lang="scss"></style>
