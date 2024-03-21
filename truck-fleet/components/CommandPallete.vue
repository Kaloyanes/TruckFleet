<script lang="ts" setup>
let isOpen = ref(false);

let route = useRoute();

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

const toast = useToast()

const pages = [
  {
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    click: () => goToRoute('/dashboard/profile')
  },
  {
    label: 'Dashboard',
    icon: 'i-heroicons-chart-bar',
    click: () => goToRoute('/dashboard/home')
  },
  {
    label: 'Orders',
    icon: 'i-material-symbols-receipt',
    click: () => goToRoute('/dashboard/orders')
  },

];

const actions = [
  {
    id: 'add-order',
    label: 'Add Order',
    icon: 'i-heroicons-plus-circle',
    click: () => {
      isOpen.value = false;
      if (!useRoute().path.includes('/dashboard/orders/'))
        useRouter().replace('/dashboard/orders/all');

      let state = useState('add');
      state.value = true;
    }
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'material-symbols:logout',
    click: () => goToRoute('/logout')
  },

]

let router = useRouter()
let selectedValue = ref('')


function goToRoute(route: string) {
  router.push(route);
  isOpen.value = false;
}
</script>

<template>
  <div>
    <CommandDialog v-model:open="isOpen">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem v-for="page in pages" :value="page.label.toLowerCase()" @click="page.click">
            <Icon :name="page.icon" class="mr-2" size="20" />
            {{ page.label }}
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem v-for="action in actions" :key="action.id" :value="action.id" @click="action.click">
            <Icon :name="action.icon" class="mr-2" size="20" />
            {{ action.label }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>

<style lang="scss"></style>
