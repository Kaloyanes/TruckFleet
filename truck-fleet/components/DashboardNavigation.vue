<script lang="ts" setup>
import { doc } from 'firebase/firestore';

let user = useCurrentUser();
let db = useFirestore();

const {
  data: profile,
} = useDocument(doc(db, `users/${user.value?.uid}`,));

let links = computed(() => [[{
  avatar: {
    src: user.value?.photoURL,
    alt: user.value?.displayName
  },
  label: `${profile.value?.name}`,
  to: `profile`,
}, {
  label: 'Dashboard',
  icon: 'i-heroicons-chart-bar',
  to: '/dashboard/home'
}, {
  label: 'Orders',
  icon: 'i-material-symbols-receipt',
  to: `orders`
}
], [
  {
    label: 'Alert',
    icon: 'i-heroicons-exclamation-circle',
    to: '/components/alert'
  },
  {
    label: 'Sign Out',
    icon: 'i-teenyicons-signin-outline',
    to: '/logout'
  }
]]);

</script>

<template>
  <div class="sticky top-0 flex-[0.2] md:block hidden  box-border h-screen overflow-y-auto ">

    <UVerticalNavigation :links="links" class="py-8 px-3 ">
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UVerticalNavigation>
  </div>
</template>

<style lang="scss"></style>
