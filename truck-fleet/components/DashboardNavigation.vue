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
  to: `/dashboard/profile`,
}, {
  label: 'Dashboard',
  icon: 'i-heroicons-chart-bar',
  to: '/dashboard/home'
}, {
  label: 'Orders',
  icon: 'i-material-symbols-receipt',
  to: `/dashboard/orders`
},
{
  label: 'Trucks',
  icon: 'i-heroicons-truck',
  to: `/dashboard/trucks`

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

const showLabel = useState<boolean>('showLabel');

function hideLabel() {
  showLabel.value = !showLabel.value;
}

</script>

<template>
  <div class="sticky top-0   transition-all duration-300 -left-full block  box-border h-screen overflow-y-auto  "
    :class="showLabel ? ' lg:flex-[0.2] max-w-none' : 'lg:flex-[0.06] xl:flex-[0.04] max-w-[65px] '">
    <UButton @click="hideLabel" variant="ghost" :icon="showLabel ?
      'i-material-symbols-menu-open' :
      'i-mdi-menu-close'" class="absolute right-3 z-50 top-1 hidden lg:block " size='2xs' />
    <UVerticalNavigation :links="links" class="py-8 px-3 ">

      <template #default="{ link }">
        <span class="group-hover:text-primary relative hidden transition-all duration-300"
          :class="(showLabel) ? 'lg:block' : 'hidden'">{{
      link.label }}</span>
      </template>

    </UVerticalNavigation>

  </div>
</template>

<style lang="scss"></style>
