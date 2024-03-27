<script lang="ts" setup>
import { Timestamp, collection, doc, query, setDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref as stRef, uploadBytesResumable } from 'firebase/storage';

let route = useRoute();
const isOpen = useState('addOrder', () => route.query.add === 'true');

const companyId = await useCompanyId();
const db = useFirestore();

// TODO: ADD DRIVERS TO THE SEARCH AND CHANGE THE INPUT TO INPUT MENU
const { data: companies, promise: companyPromise } = useCollection(collection(db, 'companiesWorkedWith'));
const { data: trucks, promise: truckPromise } = useCollection(query(collection(db, 'trucks'), where('companyId', '==', companyId.value)));



await companyPromise;
await truckPromise;


const docRef = collection(db, 'orders');

const euCountries = [
  { label: "Albania", value: "AL" },
  { label: "Andorra", value: "AD" },
  { label: "Austria", value: "AT" },
  { label: "Belarus", value: "BY" },
  { label: "Belgium", value: "BE" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Bulgaria", value: "BG" },
  { label: "Croatia", value: "HR" },
  { label: "Cyprus", value: "CY" },
  { label: "Czech Republic", value: "CZ" },
  { label: "Denmark", value: "DK" },
  { label: "Estonia", value: "EE" },
  { label: "Finland", value: "FI" },
  { label: "France", value: "FR" },
  { label: "Germany", value: "DE" },
  { label: "Greece", value: "GR" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "Ireland", value: "IE" },
  { label: "Italy", value: "IT" },
  { label: "Latvia", value: "LV" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Malta", value: "MT" },
  { label: "Moldova", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Montenegro", value: "ME" },
  { label: "Netherlands", value: "NL" },
  { label: "North Macedonia", value: "MK" },
  { label: "Norway", value: "NO" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Romania", value: "RO" },
  { label: "Russia", value: "RU" },
  { label: "San Marino", value: "SM" },
  { label: "Serbia", value: "RS" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Spain", value: "ES" },
  { label: "Sweden", value: "SE" },
  { label: "Switzerland", value: "CH" },
  { label: "Ukraine", value: "UA" },
  { label: "United Kingdom", value: "GB" },
  { label: "Vatican City", value: "VA" },
];

const slug = computed(() => useRoute().params.slug);

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
  documents: [] as String[],
  pickUpAddress: '',
  deliveryAddress: '',
  country: '',
  customerCompanyId: '',
  customerCompanyRef: doc(db, 'companiesWorkedWith', 'some'),
  worker: '',
  orderId: '',
  companyOrderId: '',
  licensePlate: (slug.value ?? '') as string,
  truckRef: doc(db, 'trucks', 'some'),
  driver: '',
  orderSum: 0,
  orderSize: '',
  note: '',
  weight: 0,
  companyId: companyId.value,

});

const ordersCount = useState('ordersCount', () => 0);

const isUploading = ref(false);
const inputRef = ref<HTMLFormElement | null>(null);

async function uploadOrder() {

  console.log(ordersCount);
  const licensePlate = docValue.licensePlate;
  const numbers = licensePlate.match(/\d+/g)?.join('') ?? '';


  console.log(licensePlate, numbers, ordersCount.value);
  const trailingOrderNumber = `${numbers}-${ordersCount.value}`;
  const documentRef = doc(db, 'orders', trailingOrderNumber);

  console.log(trailingOrderNumber);

  const files = inputRef.value?.input.files as FileList;

  if (files.length > 0) {
    isUploading.value = true;
    const storage = useFirebaseStorage();
    const storageRef = stRef(storage, `orders/${trailingOrderNumber}`);


    const promises = Array.from(files).map(async (file) => {
      const fileRef = stRef(storageRef, file.name);
      await uploadBytesResumable(fileRef, file);
      return await getDownloadURL(fileRef);
    });

    const urls = await Promise.all(promises);
    docValue.documents = urls;
  }

  docValue.customerCompanyRef = doc(db, 'companiesWorkedWith', docValue.customerCompanyId);
  docValue.truckRef = doc(db, 'trucks', docValue.licensePlate);

  isUploading.value = true;
  await setDoc(documentRef, docValue);
  isUploading.value = false;

  isOpen.value = false;

  useToast().add({
    title: 'Order Added',
    icon: 'i-heroicons-check-circle',
    // actions: [
    //   {
    //     label: 'View Order',
    //     click: () => {
    //       router.push(`/dashboard/orders/${trailingOrderNumber}`);
    //     }
    //   }
    // ]
  })
}

const isModalOpen = useState('addCompanyModal', () => false)
function openCompanyAddDialog() {
  isOpen.value = false
  setTimeout(() => {
    isModalOpen.value = true
  }, 500);
}

</script>

<template>
  <div>
    <Sheet :open="isOpen" @update:open="(e: boolean) => isOpen = e">
      <SheetTrigger>
        <UButton>Add Order</UButton>
      </SheetTrigger>
      <SheetContent class="dark:bg-cod-gray-950 rounded-l-lg overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Add Order</SheetTitle>
        </SheetHeader>
        <h1>{{ slug }}</h1>
        <UForm :state="docValue" class="flex flex-col gap-3">

          <UFormGroup label="Pick Up Time" required>
            <DateRangePickerButton v-model="docValue.pickUpTime" :range="true" />
          </UFormGroup>

          <UFormGroup label="Pick Up Address" required>
            <UInput v-model="docValue.pickUpAddress" placeholder="00000, Paris, France" />
          </UFormGroup>

          <UFormGroup label="Delivery Time" required>
            <DateRangePickerButton v-model="docValue.deliveryTime" :range="true" />
          </UFormGroup>

          <UFormGroup label="Delivery Address" required>
            <UInput v-model="docValue.deliveryAddress" placeholder="00000, Paris, France" />
          </UFormGroup>

          <UFormGroup label="Country To Pick Up From" required>
            <UInputMenu :options="euCountries" :search-attributes="['label', 'value']" v-model="docValue.country"
              placeholder="Select Country" />
          </UFormGroup>



          <UFormGroup label="Country To Deliver" required>
            <UInputMenu :options="euCountries" :search-attributes="['label', 'value']" v-model="docValue.country"
              placeholder="Select Country" />
          </UFormGroup>

          <UFormGroup label="Company Info" required>
            <div class="flex flex-col gap-y-3">

              <UInputMenu :options="companies" by="id" option-attribute="name" :search-attributes="['name']"
                v-model="docValue.customerCompanyId" value-attribute="id" placeholder="Select Company">
                <template #option-empty="{ query }">
                  <div class="p-3 text-center flex flex-col justify-center items-center gap-2">
                    <p>Company Not Found</p>
                    <UButton @click="openCompanyAddDialog" variant="soft"
                      class="flex-1 flex justify-center self-center">
                      Add
                      Company
                    </UButton>
                  </div>
                </template>
              </UInputMenu>

              <UInput placeholder="Worker" v-model="docValue.worker" />

              <UInput placeholder="Order Id" v-model="docValue.companyOrderId" />
            </div>
          </UFormGroup>


          <UFormGroup label="Truck Info" required>
            <div class="flex flex-col gap-y-3">

              <!-- <UInput v-model="docValue.truckInfo.licensePlate" placeholder="Select Truck" /> -->
              <UInputMenu :options="trucks" by="id" option-attribute="licensePlate" v-model="docValue.licensePlate"
                value-attribute="id" placeholder="Select Truck">
                <template #option-empty="{ query }">
                  <div class="p-3 text-center flex flex-col justify-center items-center gap-2">
                    <p>Company Not Found</p>
                    <UButton @click="openCompanyAddDialog" variant="soft"
                      class="flex-1 flex justify-center self-center">
                      Add
                      Company
                    </UButton>
                  </div>
                </template>
              </UInputMenu>
              <UInput v-model="docValue.driver" placeholder="Driver" />
            </div>

          </UFormGroup>

          <UFormGroup label="Order Info" required>
            <div class="flex flex-col gap-3">

              <UInput v-model="docValue.orderSum" placeholder="Sum" type="number">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
                </template>
              </UInput>

              <UInput v-model="docValue.orderSize" placeholder="Size" />

              <UInput v-model="docValue.weight" placeholder="Weight" type="number">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">kg</span>
                </template>
              </UInput>
            </div>
          </UFormGroup>




          <UFormGroup label="Documents">
            <UInput type="file" id="document-upload" multiple="multiple" ref="inputRef" />
          </UFormGroup>

          <UFormGroup label="Note">
            <UTextarea v-model="docValue.note" />
          </UFormGroup>
        </UForm>

        <div class="sticky bottom-3 flex justify-evenly px-8 gap-3 pt-5">
          <SheetClose as-child>
            <UButton @click="isOpen = false" variant="soft" class="flex-1 flex justify-center">Close</UButton>
          </SheetClose>
          <SheetClose as-child>
            <UButton @click="uploadOrder" :loading="isUploading" class="flex-1 flex justify-center">Add Order
            </UButton>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>

  </div>
</template>
