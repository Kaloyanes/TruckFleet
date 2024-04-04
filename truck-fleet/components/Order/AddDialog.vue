<script lang="ts" setup>
import { Timestamp, collection, doc, query, setDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref as stRef, uploadBytesResumable } from 'firebase/storage';
import * as yup from 'yup';

let route = useRoute();
const isOpen = computed(() => {
  return useRoute().hash === "#addOrder"
})

const companyId = await useCompanyId();
const db = useFirestore();

// TODO: ADD DRIVERS TO THE SEARCH AND CHANGE THE INPUT TO INPUT MENU
const { data: companies, promise: companyPromise } = useCollection(collection(db, 'companiesWorkedWith'));
const { data: trucks, promise: truckPromise } = useCollection(query(collection(db, 'trucks'), where('companyId', '==', companyId.value)));

// drivers
const { data: drivers, promise: driverPromise } = useCollection(query(collection(db, 'users'), where('companyId', '==', companyId.value), where('type', '==', 'driver')));


await companyPromise.value;
await truckPromise.value;
await driverPromise.value;



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

type OrderFile = {
  name: string;
  link: string;
}

console.log("trucks", drivers.value);
const schema = yup.object({
  pickUpAddress: yup.string().required("Pick Up Address is Required"),
  deliveryAddress: yup.string().required("Delivery Address is Required"),
  documents: yup.array().of(
    yup.object({
      name: yup.string().required(),
      link: yup.string().required(),
    })
  ),
  customerCompanyId: yup.string().required("Select a Company").oneOf(companies.value.map(x => x.id), "Company not found"),
  worker: yup.string().required("Worker is Required"),
  orderId: yup.string().required(),
  companyOrderId: yup.string().required("Company Order Id is Required"),
  licensePlate: yup.string().required().oneOf(trucks.value.map(x => x.licensePlate), "Truck not found"),
  driver: yup.string().required("Driver is Required").oneOf(drivers.value.map(driver => driver.name), "Driver not found"),
  orderSum: yup.number().required("Sum of the order is Required").min(1, "Sum of the order must be greater than 0"),
  orderSize: yup.string().required("Size of the order is Required"),
  note: yup.string(),
  weight: yup.number().required().min(1, "Weight must be greater than 0"),
  companyId: yup.string().required(),
  isDone: yup.boolean().required(),
})

type Schema = yup.InferType<typeof schema>;

const docValue = reactive({
  locations: [
    {
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
      pickUpAddress: '',
      deliveryAddress: '',
    }
  ],

  documents: [] as OrderFile[],

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
  isDone: false,

});

function addLocation() {
  docValue.locations.push({
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
    pickUpAddress: '',
    deliveryAddress: '',
  });
}

const reactToSlugChanges = computed(() => {
  docValue.licensePlate = (slug.value ?? '') as string;
})

const ordersCount = useState('ordersCount');

const isUploading = ref(false);
const inputRef = ref<HTMLFormElement | null>(null);

async function uploadOrder() {
  if (!(await schema.validate(docValue))) {
    return;
  }

  const licensePlate = docValue.licensePlate;
  const numbers = licensePlate.match(/\d+/g)?.join('') ?? '';



  const dateNow = new Date();
  const orderId = `${dateNow.getFullYear()}${dateNow.getMonth()}${dateNow.getDate()}${numbers}${ordersCount.value}`;
  const documentRef = doc(db, 'orders', orderId);


  const files = inputRef.value?.input.files as FileList;

  if (files.length > 0) {
    isUploading.value = true;
    const storage = useFirebaseStorage();
    const storageRef = stRef(storage, `orders/${orderId}`);


    const promises = Array.from(files).map(async (file) => {
      const fileRef = stRef(storageRef, file.name);
      await uploadBytesResumable(fileRef, file);
      return await getDownloadURL(fileRef);
    });

    const urls = await Promise.all(promises);
    docValue.documents = [
      ...docValue.documents,
      ...urls.map((url, index) => ({
        name: files[index].name,
        link: url
      }))

    ];
  }

  docValue.customerCompanyRef = doc(db, 'companiesWorkedWith', docValue.customerCompanyId);
  docValue.truckRef = doc(db, 'trucks', docValue.licensePlate);

  isUploading.value = true;
  await setDoc(documentRef, docValue);
  isUploading.value = false;

  useRouter().back();

  useToast().add({
    title: `Order Added: ${orderId}`,
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

function openCompanyAddDialog() {
  navigateTo('#addCompany')
}

function openTruckAddDialog() {
  navigateTo('#addTruck')
}

function openDriverAddDialog() {
  navigateTo('#addDriver')
}
</script>

<template>
  {{ reactToSlugChanges }}
  <div>
    <Sheet :open="isOpen" @update:open="(e: boolean) => {
    if (!e) {
      useRouter().back();
    }
  }">
      <SheetTrigger>
        <UButton @click="() => navigateTo('#addOrder')">Add Order</UButton>
      </SheetTrigger>
      <SheetContent class="dark:bg-cod-gray-950 rounded-l-lg overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Add Order</SheetTitle>
        </SheetHeader>

        <UForm :schema="schema" :state="docValue" @submit.prevent="" class="flex flex-col gap-3" v-auto-animate>
          <UFormGroup v-auto-animate>
            <div v-for="(location, index) in docValue.locations" :key="index" class="flex flex-col gap-3 mb-3"
              v-auto-animate>
              <div class="flex justify-between items-center transition-all duration-300"
                v-if="docValue.locations.length > 1" v-auto-animate>
                <h1>Location #{{ index + 1 }}</h1>
                <UButton @click="docValue.locations.splice(index, 1)" variant="soft"
                  icon="i-material-symbols-delete-forever-rounded" />
              </div>

              <UFormGroup label="Pick Up Time" name="pickUpTime" required>
                <DateRangePickerButton v-model="location.pickUpTime" :range="true" />
              </UFormGroup>

              <UFormGroup label="Pick Up Address" name="pickUpAddress" required>
                <UInput v-model="location.pickUpAddress" placeholder="00000, Paris, France" />
              </UFormGroup>

              <UFormGroup label="Delivery Time" name="deliveryTime" required>
                <DateRangePickerButton v-model="location.deliveryTime" :range="true" />
              </UFormGroup>

              <UFormGroup label="Delivery Address" name="deliveryAddress" required>
                <UInput v-model="location.deliveryAddress" placeholder="00000, Paris, France" />
              </UFormGroup>
            </div>
            <UButton @click="addLocation">Add Location</UButton>
          </UFormGroup>

          <UFormGroup label="Company Info" required>
            <div class="flex flex-col gap-y-3">

              <UFormGroup name="customerCompanyId">
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
              </UFormGroup>

              <UFormGroup name="worker">

                <UInput placeholder="Worker" v-model="docValue.worker" />
              </UFormGroup>

              <UFormGroup name="orderId">
                <UInput placeholder="Order Id" v-model="docValue.orderId" />
              </UFormGroup>
            </div>
          </UFormGroup>


          <UFormGroup label="Truck Info" required>
            <div class="flex flex-col gap-y-3">

              <UFormGroup name="licensePlate">

                <UInputMenu :options="trucks" by="id" option-attribute="licensePlate" v-model="docValue.licensePlate"
                  value-attribute="licensePlate" placeholder="Select Truck">
                  <template #option-empty="{ query }">
                    <div class="p-3 text-center flex flex-col justify-center items-center gap-2">
                      <p>Truck Not Found</p>
                      <UButton @click="openTruckAddDialog" variant="soft"
                        class="flex-1 flex justify-center self-center">
                        Add
                        Truck
                      </UButton>
                    </div>
                  </template>
                </UInputMenu>
              </UFormGroup>

              <UFormGroup name="driver">
                <UInputMenu :options="drivers" by="id" option-attribute="name" v-model="docValue.driver"
                  value-attribute="name" placeholder="Select Driver">
                  <template #option-empty="{ query }">
                    <div class="p-3 text-center flex flex-col justify-center items-center gap-2">
                      <p>Driver Not Found</p>
                      <UButton @click="openDriverAddDialog" variant="soft"
                        class="flex-1 flex justify-center self-center">
                        Add
                        Driver
                      </UButton>
                    </div>
                  </template>
                </UInputMenu>
              </UFormGroup>

            </div>
          </UFormGroup>

          <UFormGroup label="Order Info" required>
            <div class="flex flex-col gap-3">

              <UFormGroup name="orderSum">
                <UInput v-model="docValue.orderSum" placeholder="Sum" type="number">
                  <template #trailing>
                    <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
                  </template>
                </UInput>
              </UFormGroup>

              <UFormGroup name="orderSize">

                <UInput v-model="docValue.orderSize" placeholder="Size" />
              </UFormGroup>

              <UFormGroup name="weight">

                <UInput v-model="docValue.weight" placeholder="Weight" type="number">
                  <template #trailing>
                    <span class="text-gray-500 dark:text-gray-400 text-xs">kg</span>
                  </template>
                </UInput>
              </UFormGroup>
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
          <UButton type="submit" @click="uploadOrder" :loading="isUploading" class="flex-1 flex justify-center">Add
            Order
          </UButton>
        </div>
      </SheetContent>
    </Sheet>

  </div>
</template>
