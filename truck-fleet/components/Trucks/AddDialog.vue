<script lang="ts" setup>
import { addDoc, collection, Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp.fromDate(new Date()),
});

async function addTruck() {
  console.log(truckInfo);
  // useTruckStore().addTruck(truckInfo);

  // upload doc using truckInfo
  await addDoc(collection(db, "trucks"), truckInfo);

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
            <UButton variant="soft" class="flex-1 flex justify-center">Close</UButton>
          </SheetClose>
          <UButton @click="addTruck" class="flex-1 flex justify-center">Add Truck</UButton>
        </div>
      </UForm>

    </SheetContent>
  </Sheet>
</template>
