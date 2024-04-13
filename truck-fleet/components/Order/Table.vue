<script lang="ts" setup>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { format } from 'date-fns';
import { CollectionReference } from 'firebase/firestore';
const props = defineProps({
  orderQuery: {
    type: Object as () => CollectionReference<{}>,
    required: true,
  }
})

const startDate = new Date(Date.now());
startDate.setMonth(startDate.getMonth() - 1);
startDate.setMinutes(0);
startDate.setSeconds(0);


const endDate = new Date();
endDate.setMonth(startDate.getMonth() + 2);
endDate.setMinutes(0);
endDate.setSeconds(0)

let current = new Date();


const dates = ref<{
  date: Date;
  order: any | undefined;
  orderType: undefined | "pickUp" | "deliver";
  orderAddress: any;
  customerCompany: any;
}[]>([]);

let unfilteredDates = [] as any[];


const {
  data: orders,
  pending,
  promise,
} = useCollection(props.orderQuery);

promise.value.then(() => {
  generateDates();
});
await promise.value;

function checkDates(date: Date) {
  const currentTime = new Date();
  currentTime.setMinutes(0);
  currentTime.setSeconds(0);

  return currentTime.toLocaleString() === date.toLocaleString();
}

function scrollToCurrentDate(behavior: ScrollBehavior = 'instant') {
  const currentDateElement = document.querySelector('.current-date');

  if (currentDateElement) {
    currentDateElement.scrollIntoView({
      behavior,
      block: 'center',
      inline: 'center',
    });
  }
}

const reactiveOrders = computed(() => {

  for (const info of dates.value) {
    if (info.order) {
      info.order = orders.value.find((order) => (order as any).id === info.order.id);
    }
  }
});

function generateDates() {
  const datesArray = [];
  const currentDate = new Date(startDate);
  let hoursAdd = 1;

  while (currentDate <= endDate) {
    let type: "Pick Up" | "Deliver" | undefined = undefined;
    let id: string | undefined = undefined;
    let orderAddress: any = undefined;
    let orderDeliverInfo: any = undefined;
    let customerCompany: any = undefined;

    datesArray.push({
      date: new Date(currentDate),
      order: orders.value.find((order) => {
        const locations = (order as any).locations;

        let found = false;
        for (const location of locations) {
          // {
          //   'pickUpTime': {
          //     start: Timestamp;
          //     end: Timestamp;
          //   },
          //   'deliverTime': {
          //     start: Timestamp;
          //     end: Timestamp;
          //   },
          // }

          if (location.pickUpTime.start.toDate().toLocaleString() === currentDate.toLocaleString()) {
            type = 'Pick Up';
            found = true;
            id = (order as any).id;
            orderAddress = location.pickUpAddress;
            customerCompany = (order as any).customerCompanyRef;
            break;
          }

          if (location.deliveryTime.start.toDate().toLocaleString() === currentDate.toLocaleString()) {
            type = 'Deliver';
            found = true;
            id = (order as any).id;
            orderAddress = location.deliveryAddress;
            customerCompany = (order as any).customerCompanyRef;
            break;
          }
        }

        return found;
      }
      ),
      orderAddress,
      id,
      customerCompany,
      orderType: type,
    });


    // if (currentDate.getHours() >= 19 || currentDate.getHours() < 7) {
    //   hoursAdd = 2;
    // } else {
    //   hoursAdd = 1;
    // }

    currentDate.setHours(currentDate.getHours() + hoursAdd);

  }

  unfilteredDates = datesArray;
  dates.value = datesArray;

}

onMounted(() => {
  scrollToCurrentDate('instant');
})

setInterval(() => {
  const currentTime = new Date();
  currentTime.setMinutes(0);
  currentTime.setSeconds(0);


  if (currentTime.toLocaleString() !== current.toLocaleString()) {
    const currentDateElement = document.querySelectorAll('.current-date');
    const nextDateElement = document.querySelectorAll(`[data-date="${currentTime.toLocaleString()}"]`);

    if (currentDateElement && nextDateElement) {
      currentDateElement.forEach((el) => {
        el.classList.remove('current-date');
      })
    }


    current = new Date(currentTime);



    if (nextDateElement) {
      nextDateElement.forEach((el) => {
        el.classList.add('current-date');
      })
    }
  }
}, 1000);


function resetDates() {
  dates.value = Array.from(new Set(unfilteredDates));


  setTimeout(() => {
    scrollToCurrentDate('smooth');
  }, 100)
}

let filterValues = ref([] as string[]);

watch(filterValues, (value) => {
  console.log("filters", value);

  if (value.length === 0) {
    return resetDates();
  }
})


const IdFilterInput = ref<string>('');
const driverFilterInput = ref<string>('');
const typeFilterInput = ref<"all" | "pickUp" | "deliver">('all');
const addressFilterInput = ref<string>('');
const customerCompanyFilterInput = ref<string>('');
const companyWorkerFilterInput = ref<string>('');
const companyOrderIdFilterInput = ref<string>('');
const weightFilterInput = ref<string>('');
const sumFilterInput = ref<string>('');

const filteredValues = ref<Map<string, {
  value: string;
  checkValue: ((val: any, date: any) => boolean) | undefined;
  resetValueCheck: ((value: string) => boolean) | undefined;
  order: number,
}>>(new Map());

let unfiltered = unfilteredDates;


watch(filteredValues.value, (value) => {
  console.log("unOrdered values", value)

  value = new Map([...filteredValues.value.entries()].sort((a, b) => a[1].order - b[1].order));
  console.log("filteredValues", value)


  if (value.size === 0) {
    return resetDates();
  }

  unfiltered = unfilteredDates;

  for (const filter of value) {


    filterDates(filter[0], filter[1].value, filter[1].checkValue, filter[1].resetValueCheck);
  }

  dates.value = unfiltered;
})


watch(IdFilterInput, (value) => {
  if (value === "") {
    filteredValues.value.delete('id');
    return;
  }

  filteredValues.value.set('id', {
    value,
    checkValue: undefined,
    resetValueCheck: undefined,
    order: 0,
  });
})

watch(driverFilterInput, (value) => {
  if (value === "") {
    filteredValues.value.delete('driver');
    return;
  }

  filteredValues.value.set('driver', {
    value,
    checkValue: (val, date) => date.order && date.order.driver?.toLowerCase().trim().includes(val.toLowerCase()),
    resetValueCheck: (value) => value.trim() === "",
    order: 1,
  });

})

const options = [{
  value: 'all',
  label: 'All'
}, {
  value: 'Pick Up',
  label: 'Pick Up'
}, {
  value: 'Deliver',
  label: 'Deliver'
}];

watch(typeFilterInput, (value) => {
  if (value === 'all') {
    filteredValues.value.delete('type');
    return;
  }

  filteredValues.value.set('type', {
    value,
    checkValue: (val, date) => date.orderType === val,
    resetValueCheck: undefined,
    order: 9999,
  })

})


watch(addressFilterInput, (value) => {
  filterDates('orderAddress', value, (val, date) => {
    console.log(date.orderAddress);
    return date.orderAddress && date.orderAddress?.toLowerCase().trim().includes(val.toLowerCase())
  });
})

watch(customerCompanyFilterInput, (value) => {
  filterDates('customerCompany', value);
})

watch(companyWorkerFilterInput, (value) => {
  filterDates('worker', value);
})

watch(companyOrderIdFilterInput, (value) => {
  filterDates('orderId', value);
})

function filterDates(field: string, value: string, checkValue = (val: string, date: any) => {
  return date.order && date.order[field]?.toLowerCase().trim().includes(val.toLowerCase());
}, resetValueCheck = (value: string) => value.trim() === "") {
  if (resetValueCheck(value)) {
    filteredValues.value.delete(field);
    return;
  }

  console.log("field", field, value, checkValue, resetValueCheck);
  unfiltered = unfiltered.filter((date) => checkValue(value, date));
}


</script>

<template>
  {{ reactiveOrders }}
  <div class="grid auto-rows-max" v-if="orders.length !== 0">
    <div class="w-full flex-1 relative overflow-auto max-h-[75vh]  ">
      <Table>
        <TableHeader class="sticky top-0 bg-white dark:bg-cod-gray-950/30 bg-opacity-40 backdrop-blur-md z-50 ">
          <TableRow>
            <TableHead class="w-[75px]">
              Date
            </TableHead>

            <TableHead class="w-[75px]">
              Time
            </TableHead>

            <TableHead class='w-[170px]'>
              <div class="tablehead-spacing">
                Id
                <Popover>
                  <PopoverTrigger>
                    <UButton icon="i-material-symbols-filter-alt" size="2xs" variant="outline" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div class="flex flex-col gap-2">
                      <UInput placeholder="Search Id" v-model="IdFilterInput" />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>

            <TableHead class='w-[100px]'>
              Truck
            </TableHead>

            <TableHead class='md:w-[200px]'>
              <div class="tablehead-spacing">
                Driver
                <Popover>
                  <PopoverTrigger>
                    <UButton icon="i-material-symbols-filter-alt" size="2xs" variant="outline" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div class="flex flex-col gap-2">
                      <UInput placeholder="Search Drivers" v-model="driverFilterInput" />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>

            <TableHead>
              <div class="tablehead-spacing">
                Type
                <Popover>
                  <PopoverTrigger>
                    <UButton icon="i-material-symbols-filter-alt" size="2xs" variant="outline" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div class="flex flex-col gap-2">
                      <URadioGroup v-model="typeFilterInput" legend="Choose type" :options="options" class="gap-y-5" />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>

            <TableHead class="w-[300px]">
              <div class="tablehead-spacing">
                Address

                <Popover>
                  <PopoverTrigger>
                    <UButton icon="i-material-symbols-filter-alt" size="2xs" variant="outline" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div class="flex flex-col gap-2">
                      <UInput placeholder="Search Address" v-model="addressFilterInput" />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>


            <TableHead class="w-[250px]">
              Customer Company
            </TableHead>

            <TableHead class="w-[150px]">
              Company Worker
            </TableHead>

            <TableHead class="w-[150px]">
              Company Order Id
            </TableHead>

            <TableHead class="w-[170px]">
              Weight
            </TableHead>

            <TableHead class="w-[300px]">
              Size
            </TableHead>

            <TableHead class="w-[150px]">
              Sum
            </TableHead>

            <TableHead class="w-[100px]">
              Documents
            </TableHead>

            <TableHead class="max-w-[150px] justify-center">
              Notes
            </TableHead>

            <TableHead class="w-[15px] justify-center">
              Progress
            </TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(info, index) in  dates " ref="currentDateRefElement" v-memo="[dates, info.order]"
            class="divide-x-2" :class="(info.order?.isDone) ? 'bg-green-400 bg-opacity-20' : ''" :key="index">

            <TableCell class="font-medium transition-all duration-700 text-center"
              :data-date="info.date.toLocaleString()" :class="{ 'current-date': checkDates(info.date) }">
              {{ format(info.date, "dd/MM/yyyy") }}
            </TableCell>

            <TableCell class="font-medium transition-all duration-700 text-center"
              :data-date="info.date.toLocaleString()" :class="{ 'current-date': checkDates(info.date) }">
              {{ format(info.date, "HH:mm") }}
            </TableCell>

            <TableCell>
              {{ info.order?.id }}
            </TableCell>

            <TableCell>
              {{ info.order?.licensePlate }}
            </TableCell>
            <TableCell>
              {{ info.order?.driver ?? '' }}
            </TableCell>

            <TableCell>
              {{ info.orderType ?? '' }}
            </TableCell>

            <TableCell>
              {{ info.orderAddress ?? '' }}
            </TableCell>

            <TableCell>
              {{ info.customerCompany?.name ?? '' }}
            </TableCell>

            <TableCell>
              {{ info.order?.worker ?? '' }}
            </TableCell>

            <TableCell>
              {{ info.order?.orderId ?? '' }}
            </TableCell>

            <TableCell class="w-[170px]">
              {{ info.order?.weight ? `${info.order?.weight} kg` : '' }}
            </TableCell>

            <TableCell>
              {{ info.order?.orderSize }}
            </TableCell>

            <TableCell>
              {{ info.order?.orderSum ? `${info.order?.orderSum} €` : '' }}
            </TableCell>

            <TableCell>
              <div class="flex flex-col justify-center items-center gap-2 h-full">
                <div v-for="document in info.order?.documents">
                  <a :href="document.link" target="_blank" size="xs" variant="outline" class="m-0">
                    <UButton size="xs" variant="outline" class="m-0">
                      {{ document.name }}
                    </UButton>
                  </a>
                </div>
              </div>
            </TableCell>

            <TableCell class="max-h-52">
              <div class="w-[150px] text-ellipsis">
                {{ info.order?.note }}
              </div>
            </TableCell>

            <TableCell class="">
              <div class="h-max text-transparent flex justify-center items-center">
                <UCheckbox v-if="info.order" v-model="info.order.isDone" size='xs' class="m-0" />
                <div v-else>.</div>
              </div>
            </TableCell>


          </TableRow>

        </TableBody>
      </Table>
    </div>
  </div>
  <div v-else>
    <div class="flex justify-center items-center h-96">
      <p class="text-2xl">
        No orders found or wrong url
      </p>
    </div>
  </div>

</template>

<style scoped>
.current-date {
  @apply bg-primary text-black selection:bg-neutral-300;
}

.tablehead-spacing {
  @apply flex items-center gap-x-2 justify-center;
}
</style>
