<script lang="ts" setup>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Timestamp } from 'firebase-admin/firestore';
import { collection, query, where } from 'firebase/firestore';
import { TableCell } from './ui/table';

import { format } from 'date-fns';

const props = defineProps({
  licensePlate: {
    type: String,
    default: 'all'
  },
})

const db = useFirestore();

const columns = [
  { key: 'pickUpTime', label: "Pick Up Time" },
  { key: 'countryCode', label: 'Country Code' },
  { key: 'documents', label: 'Documents' },
  { key: 'addressCode', label: 'Address Code' },
  { key: 'avgCourse', label: 'Average Course' },
  { key: 'clientRef', label: 'Client Reference' },
  { key: 'clientWorker', label: 'Client Worker' },
  { key: 'companyId', label: 'Company ID' },
  { key: 'companyOrder', label: 'Company Order' },
  { key: 'courseNumber', label: 'Course Number' },
  { key: 'driver', label: 'Driver' },
  { key: 'fromToMaps', label: 'From To Maps' },
  { key: 'isDone', label: 'Is Done' },
  { key: 'isLoaded', label: 'Is Loaded' },
  { key: 'orderInCourse', label: 'Order in Course' },
  { key: 'orderSize', label: 'Order Size' },
  { key: 'orderSum', label: 'Order Sum' },
  { key: 'orderTime', label: 'Order Time' },
  { key: 'orderWeight', label: 'Order Weight' },
  { key: 'realTime', label: 'Real Time' },
  { key: 'roadCost', label: 'Road Cost' },
  { key: 'roadCostUTA', label: 'Road Cost UTA' },
  { key: 'servicedBy', label: 'Serviced By' },
  { key: 'servicedKm', label: 'Serviced Km' },
  { key: 'speditor', label: 'Speditor' },
  { key: 'speditorProfit', label: 'Speditor Profit' },
  { key: 'subCourse', label: 'Sub Course' },
  { key: 'target', label: 'Target' },
  { key: 'totalKmMaps', label: 'Total Km Maps' },
  { key: 'totalRoadCost', label: 'Total Road Cost' },
  { key: 'truckWeight', label: 'Truck Weight' },
  { key: 'ETA', label: 'ETA' },
  { key: 'id', label: 'ID' },
];


const companyId = await useCompanyId();

const orderRef = query(collection(db, 'orders'), where('companyId', '==', companyId.value));
const modifiedQuery = (ref: any) => {
  if (props.licensePlate === 'all') {
    return ref;
  }
  return query(ref, where('truck', '==', props.licensePlate));
};


const {
  data: orders,
  pending,
  promise,
} = useCollection(modifiedQuery(orderRef), {

});

promise.value.then((v) => {
  console.log('promise resolved orders laoded')
  console.log('v', v);
  console.log('orders', orders.value);
})
await promise.value;



const startDate = new Date(Date.now());
startDate.setMonth(startDate.getMonth() - 1);
startDate.setMinutes(0);
startDate.setSeconds(0);

const endDate = new Date();
endDate.setMonth(startDate.getMonth() + 2);
endDate.setMinutes(0);
endDate.setSeconds(0)

const dates = ref<{
  date: Date;
  order: any | undefined;
}[]>([]);

let cs = computed(() => {
  console.log('orders', orders.value);
  dates.value = [];
  generateDates();
});

let scrolledOnce = false;

function generateDates() {
  let hoursAdd = 1;
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    dates.value.push({
      date: new Date(currentDate),
      order: orders.value.find((order: any) => {
        let orderDate = (order.realTime as Timestamp).toDate();
        orderDate.setMinutes(0);
        orderDate.setSeconds(0);

        currentDate.setMinutes(0);
        currentDate.setSeconds(0);

        return orderDate.toLocaleString() === currentDate.toLocaleString();
      }),
    });

    currentDate.setHours(currentDate.getHours() + hoursAdd);
  }


  setTimeout(() => {
    console.log(scrolledOnce)
    if (!scrolledOnce)
      scrollToCurrentDate();
  }, 100)
}

function scrollToCurrentDate(behavior: ScrollBehavior = 'instant') {
  const currentDateElement = document.querySelector('.current-date');

  if (currentDateElement) {
    currentDateElement.scrollIntoView({ behavior, block: 'center', inline: 'center' });
    scrolledOnce = true;
  }
}


onMounted(() => {
  generateDates();
});


let current = new Date(Date.now());

current.setMinutes(0);
current.setSeconds(0);
function checkDates(otherDate: Date) {
  return current.toLocaleString() === otherDate.toLocaleString();
}

setInterval(() => {
  const currentTime = new Date();
  currentTime.setMinutes(0);
  currentTime.setSeconds(0);


  if (currentTime.toLocaleString() !== current.toLocaleString()) {
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
      currentDateElement.classList.remove('current-date');
    }

    current = new Date(currentTime);

    const nextDateElement = document.querySelector(`[data-date="${currentTime.toLocaleString()}"]`);
    if (nextDateElement) {
      nextDateElement.classList.add('current-date');
    }
  }
}, 1000);


</script>

<template>
  {{ cs }}
  <div class="grid auto-rows-max">
    <div class="w-full flex-1 relative overflow-auto max-h-[75vh]  ">
      <Table>
        <TableHeader class="sticky top-0 bg-white dark:bg-cod-gray-950/30 bg-opacity-40 backdrop-blur-md w-full">
          <TableRow>
            <TableHead class="w-[75px]">
              Date
            </TableHead>
            <TableHead class="w-[75px]">
              Time
            </TableHead>
            <TableHead class='flex items-center gap-2'>
              Item
              <Popover>
                <PopoverTrigger>
                  <UButton icon="i-material-symbols-filter-alt" size="2xs" variant="outline" />
                </PopoverTrigger>
                <PopoverContent>
                  <div class="flex flex-col gap-2">
                    <a href="https://google.com" target="_blank">Google</a>
                    <a href="https://facebook.com" target="_blank">Facebook</a>
                  </div>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead>
              3
            </TableHead>
            <TableHead>
              4
            </TableHead>
            <TableHead>
              5
            </TableHead>
            <TableHead>
              6
            </TableHead>
            <TableHead>
              6
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="info in dates" ref="currentDateRefElement">
            <TableCell class="font-medium transition-all duration-600 text-center"
              :data-date="info.date.toLocaleString()" :class="checkDates(info.date) ? 'current-date ' : ''">
              {{ format(info.date, "dd/MM/yyyy") }}
            </TableCell>
            <TableCell class="font-medium transition-all duration-600 text-center"
              :data-date="info.date.toLocaleString()" :class="checkDates(info.date) ? 'current-date ' : ''">
              {{ format(info.date, "HH:mm") }}
            </TableCell>
            <TableCell>
              1
            </TableCell>
            <TableCell>
              {{ info.order?.driver ?? '' }}
              2
            </TableCell>
            <TableCell>
              3
            </TableCell>
            <TableCell>
              4
            </TableCell>
            <TableCell>
              5
            </TableCell>
            <TableCell>
              6
            </TableCell>
          </TableRow>

        </TableBody>

      </Table>

    </div>
  </div>

</template>

<style scoped>
.current-date {
  @apply bg-primary text-black selection:bg-neutral-300;
}
</style>
