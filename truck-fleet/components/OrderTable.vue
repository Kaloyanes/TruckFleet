<script lang="ts" setup>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Timestamp } from 'firebase-admin/firestore';
import { TableCell } from './ui/table';

import { format } from 'date-fns';

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
})





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

let unfilteredDates = dates.value;


let reactivityToDataChanges = computed(() => {
  dates.value = [];
  generateDates();
});

let scrolledOnce = false;

async function generateDates() {
  let hoursAdd = 1;
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    dates.value.push({
      date: new Date(currentDate),
      order: props.orders.find((order: any) => {
        let orderDate = (order.pickUpTime.start as Timestamp).toDate();
        orderDate.setMinutes(0);
        orderDate.setSeconds(0);

        currentDate.setMinutes(0);
        currentDate.setSeconds(0);

        if (orderDate.toLocaleString() === currentDate.toLocaleString()) {
          return true;
        }

        orderDate = (order.deliveryTime.end as Timestamp).toDate();

        return orderDate.toLocaleString() === currentDate.toLocaleString();
      }),
    });

    currentDate.setHours(currentDate.getHours() + hoursAdd);
  }

  unfilteredDates = dates.value;

  setTimeout(() => {

    scrollToCurrentDate();
  }, 1000)
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

function change(e: any, order: any) {
  console.log(e, order)
}

const driverFilterInput = ref("");

watch(driverFilterInput, () => {
  dates.value = dates.value.filter((date) => {
    return date.order && date.order!.driver?.toLowerCase().trim().includes(driverFilterInput.value.toLowerCase());
  });
})

const filteredDates = computed(() => {
  if (driverFilterInput.value === "") {
    setTimeout(() => {
      scrollToCurrentDate('smooth');
    }, 200)
    return dates.value;
  }


  return dates.value.filter((date) => {
    return date.order && date.order!.driver?.toLowerCase().trim().includes(driverFilterInput.value.toLowerCase());
  });

})

</script>

<template>
  {{ reactivityToDataChanges }}
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
                Country
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
          <TableRow v-for="info in filteredDates" ref="currentDateRefElement" class="divide-x-2">
            <TableCell class="font-medium transition-all duration-600 text-center"
              :data-date="info.date.toLocaleString()" :class="checkDates(info.date) ? 'current-date ' : ''">
              {{ format(info.date, "dd/MM/yyyy") }}
            </TableCell>
            <TableCell class="font-medium transition-all duration-600 text-center"
              :data-date="info.date.toLocaleString()" :class="checkDates(info.date) ? 'current-date' : ''">
              {{ format(info.date, "HH:mm") }}
            </TableCell>
            <TableCell>
              {{ info.order?.country.value ?? '' }}
            </TableCell>
            <TableCell>
              {{ info.order?.driver ?? '' }}
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell class="flex justify-center">
              <UCheckbox @change="change($event, info.order)" />
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
