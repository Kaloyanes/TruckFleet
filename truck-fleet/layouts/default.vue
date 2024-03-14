<script lang="ts" setup>
import { collection, doc } from 'firebase/firestore';
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
  { id: 'new-file', label: 'Add new file', icon: 'i-heroicons-document-plus', click: () => toast.add({ title: 'New file added!' }), shortcuts: ['⌘', 'N'] },
  { id: 'new-folder', label: 'Add new folder', icon: 'i-heroicons-folder-plus', click: () => toast.add({ title: 'New folder added!' }), shortcuts: ['⌘', 'F'] },
  { id: 'hashtag', label: 'Add hashtag', icon: 'i-heroicons-hashtag', click: () => toast.add({ title: 'Hashtag added!' }), shortcuts: ['⌘', 'H'] },
  { id: 'label', label: 'Add label', icon: 'i-heroicons-tag', click: () => toast.add({ title: 'Label added!' }), shortcuts: ['⌘', 'L'], }
]

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
let profileDoc = useDocument(computed(() =>
  doc(collection(db, 'contacts'), user.value?.uid ?? 'none')
));

const {
  data: profile,
} = useDocument(doc(db, `users/${user.value?.uid}`,));

let links = computed(() => [[{
  avatar: {
    src: user.value?.photoURL,
    alt: user.value?.displayName
  },
  label: `${profile.value?.name ?? 'Login'}`,

}, {
  label: 'Installation',
  icon: 'i-heroicons-home',
  to: '/getting-started/installation'
}, {
  label: 'Vertical Navigation',
  icon: 'i-heroicons-chart-bar',
  to: `${route.path.startsWith('/dev') ? '/dev' : ''}/components/vertical-navigation`
}, {
  label: 'Command Palette',
  icon: 'i-heroicons-command-line',
  to: '/components/command-palette'
}], [
  {
    label: 'Alert',
    icon: 'i-heroicons-exclamation-circle',
    to: '/components/alert'
  }
]]);

</script>

<template>
  <div>
    <UModal v-model="isOpen">
      <UCommandPalette :groups="groups" @update:model-value="onSelect" />
    </UModal>

    <div class="flex">
      <UVerticalNavigation :links="links" />

      <slot />
    </div>
  </div>
</template>
