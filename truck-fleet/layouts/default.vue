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
  { id: 'new-file', label: 'Add new file', icon: 'i-heroicons-document-plus', click: () => toast.add({ title: 'New file added!' }), shortcuts: ['⌘', 'N'] },
  { id: 'new-folder', label: 'Add new folder', icon: 'i-heroicons-folder-plus', click: () => toast.add({ title: 'New folder added!' }), shortcuts: ['⌘', 'F'] },
  { id: 'hashtag', label: 'Add hashtag', icon: 'i-heroicons-hashtag', click: () => toast.add({ title: 'Hashtag added!' }), shortcuts: ['⌘', 'H'] },
  { id: 'label', label: 'Add label', icon: 'i-heroicons-tag', click: () => toast.add({ title: 'Label added!' }), shortcuts: ['⌘', 'L'] }
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


</script>

<template>
  <div>
    <UModal v-model="isOpen">
      <UCommandPalette :groups="groups" @update:model-value="onSelect" />
    </UModal>

    <slot />
  </div>
</template>
