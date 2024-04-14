<script lang="ts" setup>
import {
  Table,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
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

const typeFilterOptions = [{
  value: 'all',
  label: 'All'
}, {
  value: 'Pick Up',
  label: 'Pick Up'
}, {
  value: 'Deliver',
  label: 'Deliver'
}];

const numFilterOptions = [
  {
    value: '>=',
    label: '>='
  }, {
    value: '<=',
    label: '<='
  }, {
    value: '==',
    label: '=='
  }];


const dateFilterInput = ref<string>('');
const timeFilterInput = ref<string>('');
const IdFilterInput = ref<string>('');
const driverFilterInput = ref<string>('');
const typeFilterInput = ref<"all" | "pickUp" | "deliver">('all');
const addressFilterInput = ref<string>('');
const customerCompanyFilterInput = ref<string>('');
const companyWorkerFilterInput = ref<string>('');
const companyOrderIdFilterInput = ref<string>('');
const weightTypeAction = ref<"==" | "<=" | ">=">('>=');
const weightFilterInput = ref<string>('');
const sumTypeAction = ref<"==" | "<=" | ">=">('>=');
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
  filteredValues.value.set('id', {
    value,
    checkValue: undefined,
    resetValueCheck: (val) => val.trim() === "",
    order: 0,
  });
})

watch(driverFilterInput, (value) => {
  filteredValues.value.set('driver', {
    value,
    checkValue: (val, date) => date.order && date.order.driver?.toLowerCase().trim().includes(val.toLowerCase()),
    resetValueCheck: (value) => value.trim() === "",
    order: 1,
  });
})

watch(typeFilterInput, (value) => {


  filteredValues.value.set('type', {
    value,
    checkValue: (val, date) => date.orderType === val,
    resetValueCheck: (val) => val === 'all',
    order: 9999,
  })
})

watch(addressFilterInput, (value) => {
  filteredValues.value.set('address', {
    value,
    checkValue: (val, date) => date.orderAddress?.toLowerCase().trim().includes(val.toLowerCase()),
    resetValueCheck: (value) => value.trim() === "",
    order: 2,
  });

  console.log(filteredValues)
})

watch(customerCompanyFilterInput, (value) => {
  console.log(value);

  filteredValues.value.set('customerCompany', {
    value,
    checkValue: (val, date) => date.order && date.customerCompany?.name?.toLowerCase().trim().includes(val.toLowerCase()),
    resetValueCheck: (value) => value.trim() === "",
    order: 3,
  });
})

watch(companyWorkerFilterInput, (value) => {
  filteredValues.value.set('worker', {
    value,
    checkValue: (val, date) => date.order && date.order.worker?.toLowerCase().trim().includes(val.toLowerCase()),
    resetValueCheck: (value) => value.trim() === "",
    order: 4,
  });
})

watch(companyOrderIdFilterInput, (value) => {
  filteredValues.value.set('orderId', {
    value,
    checkValue: (val, date) => date.order && date.order.orderId?.toLowerCase().trim().includes(val.toLowerCase()),
    resetValueCheck: (value) => value.trim() === "",
    order: 5,
  });
})

// TODO: ADD TYPE OF FILTER AKA '>=', '<=', '=='
watch([weightFilterInput, weightTypeAction], (value) => {
  if (value[0] !== "")
    filteredValues.value.set("weight", {
      value: value[0],
      checkValue: (val, date) => {
        if (value[1] === '>=') {
          return date.order && date.order.weight >= parseInt(val);
        } else if (value[1] === '<=') {
          return date.order && date.order.weight <= parseInt(val);
        } else {
          return date.order && date.order.weight === parseInt(val);
        }
      },
      resetValueCheck: (value) => value.toString().trim() === "",
      order: 6,
    })
})

// TODO: ADD TYPE OF FILTER AKA '>=', '<=', '=='
watch([sumFilterInput, sumTypeAction], (value) => {
  if (value[0] !== "")
    filteredValues.value.set("sum", {
      value: value[0],
      checkValue: (val, date) => {
        if (value[1] === '>=') {
          return date.order && date.order.orderSum >= parseInt(val);
        } else if (value[1] === '<=') {
          return date.order && date.order.orderSum <= parseInt(val);
        } else {
          return date.order && date.order.orderSum === parseInt(val);
        }
      },
      resetValueCheck: (value) => value.toString().trim() === "",
      order: 7,
    })
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

const { list, containerProps, scrollTo, wrapperProps } = useVirtualList(dates, {
  itemHeight: 50,
  overscan: 35,
});
</script>

<template>
  {{ reactiveOrders }}
  <div class="grid auto-rows-max" v-if="orders.length !== 0">
    <div class="w-full flex-1 relative overflow-auto max-h-[80vh]  ">
      <Table>
        <TableHeader class="sticky top-0 bg-white dark:bg-cod-gray-950/30 bg-opacity-40 backdrop-blur-md z-50 ">
          <TableRow>
            <TableHead class="w-[75px]">
              Date
            </TableHead>

            <TableHead class="w-[75px]">
              Time
            </TableHead>

            <TableHead class='gap-x-2 w-[170px]'>
              <div class="table-header">
                Id
                <OrderFilterPop>
                  <UInput placeholder="Search Id" v-model="IdFilterInput" />
                </OrderFilterPop>
              </div>
            </TableHead>

            <TableHead class='w-[100px]'>
              Truck
            </TableHead>

            <TableHead class='gap-x-2 md:w-[200px]'>
              <div class="table-header">
                Driver
                <OrderFilterPop>
                  <UInput placeholder="Search Drivers" v-model="driverFilterInput" size="sm" />
                </OrderFilterPop>
              </div>
            </TableHead>

            <TableHead class="justify-center">
              <div class="table-header">
                Type
                <OrderFilterPop>
                  <URadioGroup v-model="typeFilterInput" legend="Choose type" :options="typeFilterOptions" />
                </OrderFilterPop>
              </div>
            </TableHead>

            <TableHead class="w-[300px]">
              <div class="table-header">
                Address
                <OrderFilterPop>
                  <UInput placeholder="Search Address" v-model="addressFilterInput" />
                </OrderFilterPop>
              </div>
            </TableHead>


            <TableHead class="w-[350px]">
              <div class="table-header">
                Customer Company
                <OrderFilterPop>
                  <UInput placeholder="Search Company" v-model="customerCompanyFilterInput" />
                </OrderFilterPop>
              </div>
            </TableHead>

            <TableHead class="w-[150px]">
              <div class="table-header">
                Company Worker
                <OrderFilterPop>
                  <UInput placeholder="Search Worker" v-model="companyWorkerFilterInput" />
                </OrderFilterPop>
              </div>
            </TableHead>

            <TableHead class="w-[150px]">
              <div class="table-header">
                Company Order Id
                <OrderFilterPop>
                  <UInput placeholder="Search Order Id" v-model="companyOrderIdFilterInput" />
                </OrderFilterPop>
              </div>
            </TableHead>

            <TableHead class="w-[170px]">
              <div class="table-header">
                Weight
                <OrderFilterPop>
                  <URadioGroup v-model="weightTypeAction" legend="Choose action" :options="numFilterOptions" />
                  <UInput placeholder="Search weight" v-model="weightFilterInput" type="number" />
                </OrderFilterPop>
              </div>
            </TableHead>

            <TableHead class="w-[300px]">
              Size
            </TableHead>

            <TableHead class="w-[150px]">
              <div class="table-header">
                Sum
                <OrderFilterPop>
                  <URadioGroup v-model="sumTypeAction" legend="Choose action" :options="numFilterOptions" />
                  <UInput placeholder="Search Sum" v-model="sumFilterInput" type="number" />
                </OrderFilterPop>
              </div>
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

        <OrderTableDataBody :dates="dates" />
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

<style scoped lang="scss">
.current-date {
  @apply bg-primary text-black selection:bg-neutral-300;
}

.table-header {
  @apply flex items-center gap-x-2;
}
</style>
