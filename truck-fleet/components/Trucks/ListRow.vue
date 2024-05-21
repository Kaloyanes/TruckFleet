<script lang="ts" setup>
const props = defineProps({
  truck: { type: Object, required: true }
})

const isTruckSelected = computed(() => {
  return useRoute().path.includes(props.truck.licensePlate)
})

const deleteSd = () => {

  if (isTruckSelected.value) {

    useRouter().push({
      hash: '#deleteTruck'
    })
    return;
  }

  const truckClicked = props.truck;

  useRouter().push({
    hash: '#deleteTruck',
    query: {
      license: truckClicked.licensePlate
    }
  })

};
</script>

<template>
  <ContextMenu>
    <TrucksDeleteDialog />
    <ContextMenuTrigger>

      <div
        class="p-2 border flex items-center transition-all duration-500 hover:scale-[1.01] active:scale-100 active:translate-y-0.5 shadow-[0_0_25px_rgba(0,0,0,0.10)] hover:shadow-[0_0_25px_rgba(0,0,0,0.10)] active:shadow-[0_0_15px_rgba(0,0,0,0.10)] justify-between rounded-[28px] px-4 "
        :class="`${isTruckSelected ? 'bg-primary/25 border-primary shadow-primary/40 hover:bg-primary/50' : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-700 shadow-neutral-800/50 hover:shadow-neutral-700/50'}`">
        <div class="flex flex-col items-start">
          <h1>{{ truck.licensePlate }}</h1>
          <h1 class="text-sm text-gray-400">{{ truck.model }}</h1>
        </div>

        <div class="flex flex-col items-end">
          <h1 class="text-sm text-gray-400">{{ truck.year }}</h1>
          <h1 class="text-sm text-gray-400" :class="`text-${(truck.status as string).split(' ').join('-')}`">
            {{ truck.status }}
          </h1>
        </div>
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent class="shadow-lg shadow-neutral-800/50 min-w-0 w-min backdrop-blur-lg bg-opacity-30 p-2">

      <ContextMenuItem>
        <UIcon name="i-material-symbols-edit-outline-rounded" />
        Edit
      </ContextMenuItem>

      <ContextMenuSeparator />
      <ContextMenuItem @click="deleteSd"
        class="text-red-500 bg-red-500/10  active:bg-red-500/15 active:text-red-500 hover:bg-red-500/20 hover:text-red-500">
        <UIcon name="i-material-symbols-delete-forever-rounded" />
        Delete
      </ContextMenuItem>

    </ContextMenuContent>
  </ContextMenu>
</template>

<style lang="scss">
.text-Available {
  @apply text-green-500;
}

.text-In-Loading {
  @apply text-primary;
}

.text-Damaged {
  @apply text-red-500;
}

.text-On-Route {
  @apply text-yellow-500;
}

.text-Delivered {
  @apply text-blue-500;
}
</style>
