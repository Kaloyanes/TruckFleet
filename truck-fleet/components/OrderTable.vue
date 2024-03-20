<script lang="ts" setup>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { collection, query, where } from 'firebase/firestore';
import type { Order } from '~/models/Order';

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


console.log(useFirestore())

const id = await useCompanyId();

const orderRef = query(collection(db, 'orders'), where('companyId', '==', id.value));
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
} = useCollection<Order>(modifiedQuery(orderRef));

promise.value.then(() => {
  console.log('Orders loaded');
  console.log(orders.value);
});


</script>

<template>
  <div class="overflow-x-scroll flex-1 max-w-[84vw] lg:max-w-[83.3vw] h-[76vh] relative overflow-auto ">
    <Table>
      <TableHeader class="sticky top-0 bg-white dark:bg-cod-gray-950">
        <TableRow>
          <TableHead class="w-[100px]">
            Time
          </TableHead>
          <TableHead class='flex items-center gap-2'>
            Status
            <Popover>
              <PopoverTrigger>
                <UButton icon="i-material-symbols-filter-alt" size="2xs" />
              </PopoverTrigger>
              <PopoverContent>
                <div class="flex flex-col gap-2">
                  <a href="https://google.com" target="_blank">Google</a>
                  <a href="https://facebook.com" target="_blank">Facebook</a>
                </div>
              </PopoverContent>
            </Popover>

          </TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="order in orders">
          <TableCell class="font-medium">
          </TableCell>
          <TableCell> {{ order.driver }}</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell class="text-right">
            $250.00
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
