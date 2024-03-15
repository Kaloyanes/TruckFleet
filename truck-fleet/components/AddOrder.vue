<script lang="ts" setup>
import { Timestamp, addDoc, collection } from 'firebase/firestore';
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
  ETA: Timestamp.now(),
  id: null,
});


const isUploading = ref(false);

async function uploadOrder() {

  isUploading.value = true;
  await addDoc(docRef, docValue);
  isUploading.value = false;

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

          <UFormGroup label="Addition">
            <UInput v-model="docValue.addition" />
          </UFormGroup>

          <UFormGroup label="Address Code">
            <UInput v-model="docValue.addressCode" />
          </UFormGroup>

          <UFormGroup label="Average Course">
            <UInput v-model="docValue.avgCourse" />
          </UFormGroup>

          <UFormGroup label="Client Reference">
            <UInput v-model="docValue.clientRef" />
          </UFormGroup>

          <UFormGroup label="Client Worker">
            <UInput v-model="docValue.clientWorker" />
          </UFormGroup>

          <UFormGroup label="Company ID">
            <UInput v-model="docValue.companyId" />
          </UFormGroup>

          <UFormGroup label="Company Order">
            <UInput v-model="docValue.companyOrder" />
          </UFormGroup>

          <UFormGroup label="Country Code">
            <UInput v-model="docValue.countryCode" />
          </UFormGroup>

          <UFormGroup label="Course Number">
            <UInput v-model="docValue.courseNumber" />
          </UFormGroup>

          <UFormGroup label="Documents">
            <div v-for="( document, index ) in  docValue.documents " :key="index" class="flex flex-col gap-3">
              <UInput v-model="document.title" />

            </div>
          </UFormGroup>

          <UFormGroup label="Driver">
            <UInput v-model="docValue.driver" />
          </UFormGroup>

          <UFormGroup label="From To Maps">
            <UInput v-model="docValue.fromToMaps" />
          </UFormGroup>

          <UFormGroup label="Is Done">
            <UInput v-model="docValue.isDone" type="checkbox" />
          </UFormGroup>

          <UFormGroup label="Is Loaded">
            <UInput v-model="docValue.isLoaded" type="checkbox" />
          </UFormGroup>

          <UFormGroup label="Order in Course">
            <UInput v-model="docValue.orderInCourse" />
          </UFormGroup>

          <UFormGroup label="Order Size">
            <UInput v-model="docValue.orderSize" />
          </UFormGroup>

          <UFormGroup label="Order Sum">
            <UInput v-model="docValue.orderSum" />
          </UFormGroup>

          <UFormGroup label="Order Time">
            <!-- <UInput v-model="docValue.orderTime" /> -->
            <DatePickerButton v-model="Timestamp.now" />
          </UFormGroup>

          <UFormGroup label="Order Weight">
            <UInput v-model="docValue.orderWeight" />
          </UFormGroup>

          <UFormGroup label="Real Time">
            <UInput v-model="docValue.realTime" />
          </UFormGroup>

          <UFormGroup label="Road Cost">
            <UInput v-model="docValue.roadCost" />
          </UFormGroup>

          <UFormGroup label="Road Cost UTA">
            <UInput v-model="docValue.roadCostUTA" />
          </UFormGroup>

          <UFormGroup label="Serviced By">
            <UInput v-model="docValue.servicedBy" />
          </UFormGroup>

          <UFormGroup label="Serviced Km">
            <UInput v-model="docValue.servicedKm" />
          </UFormGroup>

          <UFormGroup label="Speditor">
            <UInput v-model="docValue.speditor" />
          </UFormGroup>

          <UFormGroup label="Speditor Profit">
            <UInput v-model="docValue.speditorProfit" />
          </UFormGroup>

          <UFormGroup label="Sub Course">
            <UInput v-model="docValue.subCourse" />
          </UFormGroup>

          <UFormGroup label="Target">
            <UInput v-model="docValue.target" />
          </UFormGroup>

          <UFormGroup label="Total Km Maps">
            <UInput v-model="docValue.totalKmMaps" />
          </UFormGroup>

          <UFormGroup label="Total Road Cost">
            <UInput v-model="docValue.totalRoadCost" />
          </UFormGroup>

          <UFormGroup label="Truck Weight">
            <UInput v-model="docValue.truckWeight" />
          </UFormGroup>

          <UFormGroup label="ETA">
            <UInput v-model="docValue.ETA" />
          </UFormGroup>

          <UFormGroup label="ID">
            <UInput v-model="docValue.id" />
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
