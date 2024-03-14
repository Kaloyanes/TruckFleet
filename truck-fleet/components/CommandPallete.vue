<script lang="ts" setup>
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
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'i-heroicons-chart-bar',
    click: () => {
      router.push('/dashboard/home');
    }
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: 'i-material-symbols-receipt',
    click: () => {
      router.push('orders');
    }
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'i-heroicons-exclamation-circle',
    click: () => {
      router.push('/logout');
    }
  },
  {
    id: 'add-order',
    label: 'Add Order',
    icon: 'i-heroicons-plus-circle',
    click: () => {
      navigateTo('orders?add=true');
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
</script>

<template>
  <div>
    <UModal v-model="isOpen">
      <UCommandPalette :groups="groups" @update:model-value="onSelect" />
    </UModal>
  </div>
</template>

<style lang="scss"></style>
