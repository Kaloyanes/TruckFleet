<script lang="ts" setup>
const isOpen = computed(() => useRouter().currentRoute.value.hash === '#editTruck')

const licensePlate = computed(() => useRoute().query.license?.toString() || useRoute().params.license as string)
const trucksStore = useTrucksStore();


let truckInfoCopy = computed(() => useTrucksStore().unfilteredTrucks.find(truck => truck.licensePlate === licensePlate.value));

// watch(trucksStore.unfilteredTrucks, (value) => {
//   truckInfoCopy.value = value.find(truck => truck.licensePlate === licensePlate.value);
// })
</script>

<template>
  <Sheet :open="isOpen" @update:open="(e: any) => {
    if (isOpen) useRouter().back()
  }">

    <SheetContent class="flex flex-col gap-3">
      <SheetTitle>
        Edit Truck
      </SheetTitle>


      <!-- <TrucksForm :model-value="truckInfoCopy" @update:truck="(e: any) => truckInfoCopy = e" /> -->

      {{ truckInfoCopy }}
    </SheetContent>
  </Sheet>
</template>

<style lang="scss"></style>
