<script lang="ts" setup>
import { doc } from 'firebase/firestore';

let user = useCurrentUser();
let db = useFirestore();

const {
  data: profile,
} = useDocument(doc(db, `users/${user.value?.uid}`,));

const links = [
  {
    title: 'Home',
    href: '/dashboard/home',
    icon: 'i-material-symbols-home-outline-rounded',
  },
  {
    title: 'Orders',
    href: '/dashboard/orders/all',
    icon: 'i-material-symbols-receipt',
  },
  {
    title: 'Trucks',
    href: '/dashboard/trucks',
    icon: 'i-heroicons-truck',
  }
]

const endLinks = [
  {
    title: 'Settings',
    href: '/dashboard/profile/general',
    icon: 'i-heroicons-cog',
  },
  {
    title: 'Logout',
    href: '/logout',
    icon: 'i-material-symbols-logout-rounded',
  }
]

</script>

<template>
  <div class="h-screen py-5 flex flex-col gap-5 items-center">
    <DashboardLogo />
    <DashboardItem v-for="link in links" :link="link" :exact-type="false" />
    <div class="flex-1" />

    <DashboardItem :link="{
      title: profile?.name,
      href: '/dashboard/profile/account',
    }" :exact-type="true">
      <template #icon>
        <UAvatar :src="profile?.profilePicture" class="w-6 h-6" />
      </template>
    </DashboardItem>
    <DashboardItem v-for=" link  in  endLinks " :link="link" />
  </div>
</template>

<style lang="scss"></style>
