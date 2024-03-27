<script lang="ts" setup>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CollectionReference } from 'firebase/firestore';
import { TableCell } from './ui/table';

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
}[]>([]);

let unfilteredDates = [] as any[];


const {
  data: orders,
  pending,
  promise,
} = useCollection(props.orderQuery);

promise.value.then(() => {
  console.log('orders loaded');
  generateDates();
});
await promise.value;


const IdFilterInput = ref<string>('');
const driverFilterInput = ref<string>('');


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
  console.log('orders', orders.value);

  for (const info of dates.value) {
    if (info.order) {
      info.order = orders.value.find((order) => (order as any).id === info.order.id);
    }
  }
});

function generateDates() {
  const datesArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    let type: "Pick Up" | "Deliver" | undefined = undefined;
    let id: string | undefined = undefined;
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
            console.log(order);
            found = true;
            id = (order as any).id;
            break;
          }

          if (location.deliveryTime.start.toDate().toLocaleString() === currentDate.toLocaleString()) {
            type = 'Deliver';
            found = true;
            id = (order as any).id;
            break;
          }
        }

        return found;
      }
      ),

      id: id,
      orderType: type,
    });

    currentDate.setHours(currentDate.getHours() + 1);

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

    if (currentDateElement) {
      currentDateElement.forEach((el) => {
        el.classList.remove('current-date');
      })
    }


    current = new Date(currentTime);


    const nextDateElement = document.querySelectorAll(`[data-date="${currentTime.toLocaleString()}"]`);

    if (nextDateElement) {
      nextDateElement.forEach((el) => {
        el.classList.add('current-date');
      })
    }
  }
}, 1000);

// function change(e: any, order: any) {
//   console.log(e, order)
// }

function resetDates() {
  // use set to remove duplicates by id
  dates.value = Array.from(new Set(unfilteredDates));


  setTimeout(() => {
    scrollToCurrentDate('smooth');
  }, 100)
}

watch(IdFilterInput, (value) => {
  if (value === '') return resetDates();

  filterDates('id', value);
})

watch(driverFilterInput, (value) => {
  if (value === '') return resetDates();

  filterDates('driver', value);
})

function filterDates(field: string, value: string) {
  const filteredDatesSet = new Set(
    unfilteredDates.filter((date) => {
      return date.order && date.order[field]?.toLowerCase().trim().includes(value.toLowerCase());
    })
  );
  dates.value = Array.from(filteredDatesSet);
  console.log(dates.value);
}
</script>

<template>
  {{ reactiveOrders }}
  <div class="grid auto-rows-max" v-if="orders.length !== 0">
    <div class="w-full flex-1 relative overflow-auto max-h-[75vh]  ">
      <Table>
        <TableHeader class="sticky top-0 bg-white dark:bg-cod-gray-950/30 bg-opacity-40 backdrop-blur-md w-full z-50 ">
          <TableRow>
            <TableHead class="w-[75px]">
              Date
            </TableHead>
            <TableHead class="w-[75px]">
              Time
            </TableHead>
            <TableHead class='gap-x-2 w-[170px]'>
              <div class="flex items-center gap-x-2">
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
            <TableHead class='gap-x-2 md:w-[200px]'>
              <div class="flex items-center gap-x-2">
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
              4
            </TableHead>
            <TableHead class="w-[25px] justify-center">
              Progress
            </TableHead>
            <TableHead>
              6
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(info, index) in dates" ref="currentDateRefElement" class="divide-x-2" v-memo="[dates]"
            :key="info.date.getDate()">
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
            <!-- <TableCell>
              {{ info.order?.country.value ?? '' }}
            </TableCell> -->
            <TableCell>
              {{ info.order?.driver ?? '' }}
            </TableCell>
            <TableCell>
              {{ info.orderType ?? '' }}
            </TableCell>
            <TableCell class="flex justify-center">

              <UCheckbox v-if="info.order" />
            </TableCell>
            <TableCell>

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
</style>
