<script lang="ts" setup>
import { collection } from 'firebase/firestore';
import type { Order } from '~/models/Order';

const db = useFirestore();

const columns = [
  { key: 'time', label: "Time" },
  { key: 'countryCode', label: 'Country Code' },
  { key: 'roadCost', label: 'Road Cost' },
  { key: 'date', label: 'Date' },
  { key: 'total', label: 'Total' },
  { key: 'actions', label: 'Actions' },
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
  <h1>{{ todayDateWithTime.getHours() }}:00</h1>
  <UTable :rows="orders" :loading="pending" :columns="columns">
    <template #time-data="{ row }">
      <h1>
        <!-- Parse the date -->
        {{ getDate(row).getHours() }}:00
      </h1>
    </template>
  </UTable>

</template>
