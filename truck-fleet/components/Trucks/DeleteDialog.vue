<script lang="ts" setup>
const isOpen = computed(() => useRouter().currentRoute.value.hash === '#deleteTruck')

const truck = computed(() => useRoute().query.license?.toString() || useRoute().params.license as string)

async function DeleteTruck() {
  const trucksStore = useTrucksStore();

  console.log(trucksStore.trucks);
  const license = useRoute().query.license?.toString() || useRoute().params.license as string;

  const truckDocument = trucksStore.trucks.find(truck => {
    console.log(truck.licensePlate, license);
    return truck.licensePlate === license;
  })!;

  if (truckDocument === undefined) {
    return;
  }


  console.log(truckDocument.id);
  const toast = useToast();

  try {

    await trucksStore.deleteTruck(truckDocument.id);
  } catch (e) {
    console.log(e);
    toast.add({
      title: `Failed to delete truck ${license}`,
      icon: 'i-ion-md-close-circle-outline',
      color: 'red',
    });
  } finally {
    toast.add({
      title: `Successfully deleted truck ${license}`,
      icon: 'i-ion-md-checkmark-circle-outline',
      color: 'green',
    });
  }

  if (useRoute().query.license?.toString())
    useRouter().replace({
      path: '/dashboard/trucks',
      hash: ''
    });

  useRouter().replace({
    hash: ''
  });
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="(e: any) => useRouter().back()">

    <DialogContent>
      <DialogTitle>
        <h1 class="text-3xl font-bold">Delete Truck</h1>

      </DialogTitle>
      <div class="flex flex-col gap-3">
        <p>Are you sure you want to delete {{ truck }}?</p>

        <div class="flex justify-end gap-3">
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" @click="DeleteTruck">Delete</Button>
        </div>
      </div>

    </DialogContent>
  </Dialog>
</template>

<style lang="scss"></style>
