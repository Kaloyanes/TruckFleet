<script lang="ts" setup>
const isOpen = computed(() => useRouter().currentRoute.value.hash === '#editTruck')

const licensePlate = computed(() => useRoute().query.license?.toString() || useRoute().params.license as string)
const trucksStore = useTrucksStore();


let truckInfoCopy = computed(() => trucksStore.rawTrucks.find(truck => truck.licensePlate === licensePlate.value));

// watch(trucksStore.unfilteredTrucks, (value) => {
//   truckInfoCopy.value = value.find(truck => truck.licensePlate === licensePlate.value);
// })

async function edit(newData: any) {

  console.log(truckInfoCopy.value)
  console.log(newData)
  try {
    await trucksStore.editTruck(newData, newData.id);
  } catch (e: any) {
    console.log(e)
    const toast = useToast()
    toast.add({
      title: `Failed to edit truck ${licensePlate.value}`,
      icon: 'i-ion-md-close-circle-outline',
      color: 'red',
      description: e.message,
    })
  }
}
</script>

<template>
  <Sheet :open="isOpen" @update:open="(e: any) => {
    if (isOpen) useRouter().back()
  }">

    <SheetContent class="flex flex-col gap-3" :force-mount="false">
      <SheetTitle>
        Edit Truck
      </SheetTitle>


      <TrucksForm :model-value="truckInfoCopy" @update:truck="(e: any) => truckInfoCopy = e"
        v-on:submit:edit="(e) => edit(e)" />

      {{ truckInfoCopy?.id ?? '' }}
    </SheetContent>
  </Sheet>
</template>

<style lang="scss"></style>
