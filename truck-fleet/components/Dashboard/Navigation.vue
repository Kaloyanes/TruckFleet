<script lang="ts" setup>
import { doc } from 'firebase/firestore';

let user = useCurrentUser();
let db = useFirestore();

const {
  data: profile,
  promise: profilePromise
} = useDocument(doc(db, `users/${user.value?.uid}`,));

await profilePromise.value;

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
    title: 'Logout',
    href: '/logout',
    icon: 'i-material-symbols-logout-rounded',
  }
]

console.log(profile.value!.profilePicture)
const profileLink = {
  title: 'Profile',
  href: '/dashboard/profile/account',
  icon: 'i-heroicons-user-circle',
}
</script>

<template>
  <div class="h-screen py-5 flex flex-col gap-5 items-center" v-motion :initial="{ opacity: 0, scale: 0.5, x: -100 }"
    :enter="{
    opacity: 1, scale: 1, x: 0, transition: {
      duration: 500,
      delay: 150,
    }
  }">
    <DashboardLogo />

    <DashboardItem v-for="link in links" :link="link" :exact-type="false" />
    <div class="flex-1" />

    <DashboardItem :link="{
    title: profile?.name,
    href: '/dashboard/profile',
  }" v-if="profile?.profilePicture">
      <template #icon>
        <Avatar class="w-6 h-6">
          <AvatarImage :src="profile!.profilePicture!" alt="Profile Picture" />
        </Avatar>
      </template>
    </DashboardItem>
    <DashboardItem v-else :link="profileLink" />
    <DashboardItem v-for="  link   in   endLinks  " :link="link" />
  </div>
</template>

<style lang="scss"></style>
