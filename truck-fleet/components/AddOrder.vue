<script lang="ts" setup>
import { Timestamp, collection } from 'firebase/firestore';
import type { Order } from '~/models/Order';

let route = useRoute();
const isVisible = ref(route.query.add === 'true');

const db = useFirestore();
const docRef = collection(db, 'orders');

const docValue = reactive<Order>({
  addition: null,
  addressCode: 123,
  avgCourse: 4.5,
  clientRef: null,
  clientWorker: 'John Doe',
  companyId: 'ABC123',
  companyOrder: 'ORD456',
  countryCode: 'US',
  courseNumber: 1,
  documents: [
    { title: 'Document 1', link: 'https://example.com/document1' },
    { title: 'Document 2', link: 'https://example.com/document2' },
  ],
  driver: 'Jane Smith',
  fromToMaps: 10,
  isDone: false,
  isLoaded: true,
  orderInCourse: 2,
  orderSize: 'Large',
  orderSum: 1000,
  orderTime: Timestamp.now(),
  orderWeight: 500,
  realTime: Timestamp.now(),
  roadCost: 200,
  roadCostUTA: 150,
  servicedBy: 'Service Provider',
  servicedKm: 100,
  speditor: 'Speditor',
  speditorProfit: 50,
  subCourse: 1,
  target: 50,
  totalKmMaps: 500,
  totalRoadCost: 1000,
  truckWeight: 1000,
  ETA: Timestamp.fromDate(

    // ROunded date to the nearest 00 or 30 minutes

    new Date(Math.ceil(Date.now() / 1800000) * 1800000)
  ),
  id: null,
});


const isUploading = ref(false);

async function uploadOrder() {

  console.log('Uploading order', docValue.ETA.toDate());

  // isUploading.value = true;
  // await addDoc(docRef, docValue);
  // isUploading.value = false;

  isVisible.value = false;
}
</script>

<template>
  <div>
    <UButton @click="isVisible = true">Add Order</UButton>

    <USlideover v-model="isVisible" class="overflow-y-scroll h-full">
      <UCard class="flex flex-col flex-1 p-8" :ui="{
      body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800'
    }">
        <h1 class=" text-2xl text-center">Add Order</h1>
        <UForm :state="docValue" class="flex flex-col gap-3">



          <UFormGroup label="Order Time">
            <DatePickerButton v-model="(docValue.orderTime as Timestamp)" />
          </UFormGroup>

          <UFormGroup label="ETA">
            <DatePickerButton v-model="(docValue.ETA as Timestamp)" />
          </UFormGroup>

        </UForm>

        <div class="sticky bottom-3 flex justify-evenly px-8 gap-3 pt-5">

          <UButton @click="isVisible = false" variant="soft" class="flex-1 flex justify-center">Close</UButton>
          <UButton @click="uploadOrder" :loading="isUploading" class="flex-1 flex justify-center">Add Order
          </UButton>
        </div>
      </UCard>
    </USlideover>
  </div>
</template>
