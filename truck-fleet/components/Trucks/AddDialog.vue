<script lang="ts" setup>
import { Timestamp } from "firebase/firestore";

const isModalOpen = computed(() => {
  return useRoute().hash == "#addTruck";
})

const companyId = await useCompanyId();
const db = useFirestore();

const truckInfo = reactive({
  licensePlate: "",
  companyId: companyId.value as string,
  model: "Ford",
  year: 2021,
  status: "Available",
  createdAt: Timestamp.fromDate(new Date()),
});

async function addTruck() {
  console.log(truckInfo);

  // upload doc using truckInfo

  const trucksStore = await useTrucksStore();
  try {
    await trucksStore.createTruck(truckInfo);

    const toast = useToast();

    toast.add({
      title: `Successfully added truck ${truckInfo.licensePlate}`,
      icon: 'i-ion-md-checkmark-circle-outline',
      color: 'green',
    });
  } catch (e: any) {
    const toast = useToast();

    toast.add({
      title: `Failed to add truck ${truckInfo.licensePlate}: ${e.message}`,
      icon: 'i-ion-md-close-circle-outline',
      color: 'red',
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
      <UForm :state="truckInfo" class="flex flex-col gap-3">

        <UInput v-model="truckInfo.licensePlate" placeholder="License Plate" />
        <UInput v-model="truckInfo.model" placeholder="Model" />
        <UInput v-model="truckInfo.year" placeholder="Year" type="number" />

        <div class="sticky bottom-3 flex justify-evenly px-8 gap-3 pt-5 ">

          <SheetClose as-child>
            <Button variant="outline" class="flex-1 flex justify-center">Close</Button>
          </SheetClose>
          <Button @click="addTruck" class="flex-1 flex justify-center">Add Truck</Button>
        </div>
      </UForm>

    </SheetContent>
  </Sheet>
</template>
