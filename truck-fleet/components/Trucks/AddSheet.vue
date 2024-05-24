<script lang="ts" setup>

const isModalOpen = computed(() => {
  return useRoute().hash == "#addTruck";
})

const db = useFirestore();
const trucksStore = useTrucksStore();

async function addTruck(newData: any) {

  const toast = useToast();

  try {
    await trucksStore.createTruck(newData);

    toast.add({
      title: `Truck ${newData.licensePlate} created`,
      icon: "i-ph-check-circle",
      color: "green",
    });

  } catch (e: any) {
    toast.add({
      title: "Failed to Add Truck",
      description: e.message,
      icon: "i-ph-x-circle",
      color: "red",
    });

  }

  useRouter().back();
}
</script>

<template>
  <Sheet :open="isModalOpen" @update:open="(e) => useRouter().back()">
    <SheetContent>
      <SheetHeader class="pb-2">
        <SheetTitle>Add Truck</SheetTitle>
      </SheetHeader>

      <TrucksForm v-on:submit:edit="(e) => addTruck(e)" />

    </SheetContent>
  </Sheet>
</template>
