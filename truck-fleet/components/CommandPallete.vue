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
  f1: {
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
  {
    label: 'Trucks',
    icon: 'i-heroicons-truck',
    click: () => goToRoute('/dashboard/trucks')
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog',
    click: () => goToRoute('/dashboard/profile/general')
  }

];

const actions = [
  {
    label: 'Add Order',
    icon: 'i-heroicons-plus-circle',
    click: () => {
      openDialog(['/dashboard/orders'], '#addOrder');

    }
  },
  {
    label: 'Add Company',
    icon: 'material-symbols:add-business',
    click: () => {
      openDialog(['/dashboard/orders'], '#addCompany');


    }
  },
  {
    label: 'Add Truck',
    icon: 'mdi:truck-plus',
    click: () => {
      openDialog(['/dashboard/trucks'], '#addTruck')
    }
    // click: () => {
    //   (document.activeElement as HTMLElement).blur();

    //   isOpen.value = false;
    //   let route = useRoute();


    //   setTimeout(() => {
    //     if (!route.path.includes('/dashboard/trucks') && !route.path.includes('/dashboard/orders')) {
    //       useRouter().replace('/dashboard/trucks#addTruck');
    //       return;
    //     }

    //     navigateTo("#addTruck")
    //   }, 100)
    // }
  },
  {
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

function openDialog(links: string[], hash: string) {
  const routeCheck = () => {
    // go through each link and check if the route is the same as the current route
    for (let link of links) {
      if (route.fullPath.includes(link)) {
        return true;
      }
    }
  }

  (document.activeElement as HTMLElement).blur();

  isOpen.value = false;
  let route = useRoute();

  console.log("route", `${links[0]}${hash}`);

  setTimeout(async () => {
    if (!routeCheck()) {
      await navigateTo(`${links[0]}`);
    }

    await navigateTo(hash)
  }, 100)
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
          <CommandItem v-for="action in actions" :key="action.label" :value="action.label" @click="action.click">
            <Icon :name="action.icon" class="mr-2" size="20" />
            {{ action.label }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>

<style lang="scss"></style>
