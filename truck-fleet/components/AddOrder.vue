<script lang="ts" setup>
import { Timestamp, collection } from 'firebase/firestore';

let route = useRoute();
const isVisible = ref(route.query.add === 'true');

const db = useFirestore();
const docRef = collection(db, 'orders');

const euCountries = [
  { label: 'Albania', value: 'AL' },
  { label: 'Andorra', value: 'AD' },
  { label: 'Austria', value: 'AT' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Faroe Islands', value: 'FO' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Gibraltar', value: 'GI' },
  { label: 'Greece', value: 'GR' },
  { label: 'Guernsey', value: 'GG' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Isle of Man', value: 'IM' },
  { label: 'Italy', value: 'IT' },
  { label: 'Jersey', value: 'JE' },
  { label: 'Kosovo', value: 'XK' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Liechtenstein', value: 'LI' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Malta', value: 'MT' },
  { label: 'Moldova', value: 'MD' },
  { label: 'Monaco', value: 'MC' },
  { label: 'Montenegro', value: 'ME' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'North Macedonia', value: 'MK' },
  { label: 'Norway', value: 'NO' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Romania', value: 'RO' },
  { label: 'Russia', value: 'RU' },
  { label: 'San Marino', value: 'SM' },
  { label: 'Serbia', value: 'RS' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Spain', value: 'ES' },
  { label: 'Svalbard and Jan Mayen', value: 'SJ' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Ukraine', value: 'UA' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Vatican City', value: 'VA' }
]

const docValue = reactive({
  addition: null,
  addressCode: 123,
  avgCourse: 4.5,
  clientRef: null,
  clientWorker: 'John Doe',
  companyId: 'ABC123',
  companyOrder: 'ORD456',
  countryCode: 'BG',
  courseNumber: 1,
  documents: [] as File[],
  driver: 'Jane Smith',
  fromToMaps: 10,
  isDone: false,
  isLoaded: true,
  orderInCourse: 2,
  orderSize: 'Large',
  orderSum: 1000,
  orderTime: Timestamp.fromDate(
    new Date(Math.ceil(Date.now() / 1800000) * 1800000)
  ),
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
    new Date(Math.ceil(Date.now() / 1800000) * 1800000)
  ),
  id: null,
});


const isUploading = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (isVisible.value) {
    inputRef.value = document.querySelector('#document-upload') as HTMLInputElement;
    console.log('inputRef', inputRef.value);
  }
})


async function uploadOrder() {

  docValue.documents = Array.from(inputRef.value?.files || []);
  console.log('Uploading order', docValue.documents);
  // isUploading.value = true;
  // await addDoc(docRef, docValue);
  // isUploading.value = false;

  isVisible.value = false;
}


const loading = ref(false)


async function search(q: string) {
  loading.value = true

  const users = await $fetch<any[]>('https://jsonplaceholder.typicode.com/users', { params: { q } })

  loading.value = false

  return users
}

async function clear() {

  docValue.addition = null;
  docValue.addressCode = 15;
  docValue.avgCourse = 4.5;
  docValue.clientRef = null;
  docValue.clientWorker = 'John Doe';
  docValue.companyId = 'ABC123';
  docValue.companyOrder = 'ORD456';
  docValue.countryCode = 'BG';
  docValue.courseNumber = 1;
  docValue.documents = [];
  docValue.driver = 'Jane Smith';
  docValue.fromToMaps = 10;
  docValue.isDone = false;
  docValue.isLoaded = true;
  docValue.orderInCourse = 2;
  docValue.orderSize = 'Large';
  docValue.orderSum = 1000;
  docValue.orderTime = Timestamp.fromDate(
    new Date(Math.ceil(Date.now() / 1800000) * 1800000)
  );
  docValue.orderWeight = 500;
  docValue.realTime = Timestamp.now();
  docValue.roadCost = 200;
  docValue.roadCostUTA = 150;
  docValue.servicedBy = 'Service Provider';
  docValue.servicedKm = 100;
  docValue.speditor = 'Speditor';
  docValue.speditorProfit = 50;
  docValue.subCourse = 1;
  docValue.target = 50;
  docValue.totalKmMaps = 500;
  docValue.totalRoadCost = 1000;
  docValue.truckWeight = 1000;
  docValue.ETA = Timestamp.fromDate(
    new Date(Math.ceil(Date.now() / 1800000) * 1800000)
  );
  docValue.id = null;
}
</script>

<template>
  <div>
    <UButton @click="isVisible = true">Add Order</UButton>

    <USlideover v-model="isVisible" class="overflow-y-scroll h-full" @close="clear">
      <UCard class="flex flex-col flex-1 p-8" :ui="{
      body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800'
    }">
        <h1 class=" text-2xl text-center">Add Order</h1>
        <UForm :state="docValue" class="flex flex-col gap-3">

          <UFormGroup label="ETA" required>
            <DatePickerButton v-model="(docValue.ETA as Timestamp)" />
          </UFormGroup>

          <UFormGroup label="Delivery Address" required>
            <div class="flex flex-col gap-3">
              <USelect v-model="docValue.countryCode" :options="euCountries.sort()" />
              <UInput v-model="docValue.addressCode" type="number" label="Address Code" />
            </div>
          </UFormGroup>

          <UFormGroup label="Order Prize" required>
            <UInput v-model="docValue.orderSum" type="number">
              <template #trailing>
                <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup label="Order Size" required>
            <UInput v-model="docValue.orderSize" />
          </UFormGroup>

          <UFormGroup label="Order Weight" required>
            <UInput v-model="docValue.orderWeight" type="number" />
          </UFormGroup>

          <UFormGroup label="From To Maps">
            <UInput v-model="docValue.fromToMaps" type="number" />
          </UFormGroup>

          <UFormGroup label="Select Company" required>
            <UInputMenu v-model="docValue.companyId" placeholder="Select a company or type it here" autocomplete
              :search="search" :loading="loading" option-attribute="name" trailing by="id" />
          </UFormGroup>

          <UFormGroup label="Company Worker">
            <UInput v-model="docValue.clientWorker" />
          </UFormGroup>

          <UFormGroup label="Driver">
            <UInputMenu v-model="docValue.driver" placeholder="Select a driver" autocomplete :search="search"
              :loading="loading" option-attribute="name" trailing by="id" />
          </UFormGroup>

          <UFormGroup label="Documents">
            <UInput type="file" id="document-upload" multiple="multiple" v-model="docValue.documents" ref="inputRef" />
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
