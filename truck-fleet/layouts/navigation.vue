<script lang="ts" setup>
import { doc } from 'firebase/firestore';
let isOpen = ref(false);

let route = useRoute();

if (route.name !== 'login') {
  defineShortcuts({
    meta_p: {
      usingInput: true,
      handler: () => {
        isOpen.value = !isOpen.value;
      }
    },
    escape: {
      usingInput: true,
      whenever: [isOpen],
      handler: () => { isOpen.value = false }

    }
  })
}

const toast = useToast()

const actions = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    click: () => {
      router.push('profile');
    },
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'i-heroicons-exclamation-circle',
    click: () => {

      router.push('/logout');
    }
  }
];

let router = useRouter()

function onSelect(option: any) {

  console.log(option);
  if (option.click) {
    option.click();
  }

  isOpen.value = false;
}

let groups = [
  {
    key: 'commands', label: 'Commands', commands: actions, icon: 'fas fa-terminal'
  }
]

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
  <div>
    <UModal v-model="isOpen">
      <UCommandPalette :groups="groups" @update:model-value="onSelect" />
    </UModal>

    <div class="flex">
      <UVerticalNavigation :links="links" class="flex-[0.2] md:block hidden py-8 px-3">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{ link.label }}</span>
        </template>
      </UVerticalNavigation>

      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
