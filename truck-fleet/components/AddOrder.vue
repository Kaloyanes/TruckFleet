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
  pickUpTime: {
    start: Timestamp.fromDate(
      new Date(Math.ceil(Date.now() / 1800000) * 1800000)
    ),
    end: Timestamp.fromDate(
      new Date(Math.ceil(Date.now() / 1800000) * 1800000)
    ),
  },
  deliveryTime: {
    start: Timestamp.fromDate(
      new Date(Math.ceil(Date.now() / 1800000) * 1800000)
    ),
    end: Timestamp.fromDate(
      new Date(Math.ceil(Date.now() / 1800000) * 1800000)
    ),
  },
  documents: [] as File[],
  pickUpAddress: '',
  deliveryAddress: '',
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

  // docValue.documents = Array.from(inputRef.value?.files || []);
  console.log('Uploading order', docValue.pickUpTime);
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

const loadingCountries = ref(false)
async function searchCountries(q: string) {
  loadingCountries.value = true

  const countries = euCountries.filter((country) => country.label.toLowerCase().includes(q.toLowerCase()))

  loadingCountries.value = false

  return countries

}

async function clear() {


  // docValue.ETA = Timestamp.fromDate(
  //   new Date(Math.ceil(Date.now() / 1800000) * 1800000)
  // );
  docValue.pickUpTime = {
    start: Timestamp.fromDate(
      new Date(Math.ceil(Date.now() / 1800000) * 1800000)
    ),
    end: Timestamp.fromDate(
      new Date(Math.ceil(Date.now() / 1800000) * 1800000)
    ),
  }
}

</script>

<template>
  <div>
    <UButton @click="isVisible = true">Add Order</UButton>

    <USlideover v-model="isVisible" class="overflow-y-scroll h-full " @close="clear">
      <UCard class="flex flex-col flex-1 p-8 dark:bg-cod-gray-950" :ui="{
      body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800'
    }">
        <h1 class=" text-xl pb-5">Add Order</h1>


        <UForm :state="docValue" class="flex flex-col gap-3">

          <UFormGroup label="Pick Up Time" required>
            <DateRangePickerButton v-model="docValue.pickUpTime" :range="true" />
          </UFormGroup>

          <UFormGroup label="Pick Up Address" required>
            <UInput v-model="docValue.pickUpAddress" />
          </UFormGroup>

          <UFormGroup label="Delivery Time" required>
            <DateRangePickerButton v-model="docValue.deliveryTime" :range="true" />
          </UFormGroup>

          <UFormGroup label="Delivery Address" required>
            <UInput v-model="docValue.deliveryAddress" />
          </UFormGroup>

          <UFormGroup label="Documents">
            <UInput type="file" id="document-upload" multiple="multiple" ref="inputRef" />
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
