<script lang="ts" setup>
import { collection } from 'firebase/firestore';
import type { Order } from '~/models/Order';

const db = useFirestore();

const columns = [
  { key: 'time', label: "Time" },
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

const {
  data: orders,
  pending,
  promise,
} = useCollection<Order>(collection(db, 'orders'));

const todayDateWithTime = new Date();

promise.value.then(() => {
  console.log('Orders loaded');
  console.log(orders.value);

});

function getDate(row: any) {
  return new Date((row as Order).realTime.toMillis());
};

</script>

<template>
  <UTable :rows="orders" :loading="pending" :columns="columns">
    <template #time-data="{ row }">
      <h1>
        {{ getDate(row).getHours() }}:00
      </h1>
    </template>
    <template #documents-data="{ row }">
      <div class="flex flex-col gap-2">
        <a :href="url.link" v-for="url in row.documents" target="_blank">{{ url.title }}</a>
      </div>
    </template>
  </UTable>
</template>
