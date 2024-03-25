<script lang="ts" setup>

import { collection, query, where } from 'firebase/firestore';

const licensePlate = useRoute().params.slug;

const db = useFirestore();

const companyId = await useCompanyId();

const orderRef = query(collection(db, 'orders'), where('companyId', '==', companyId.value));
const modifiedQuery = (ref: any) => {
  if (licensePlate === 'all') {
    return ref;
  }
  return query(ref, where('truck', '==', licensePlate));
};


const {
  data: orders,
  pending,
  promise,
} = useCollection(modifiedQuery(orderRef));

promise.value.then((v) => {
  console.log('promise resolved orders laoded')
  console.log('v', v);
  console.log('orders', orders.value);
})
await promise.value;

</script>

<template>
  <div class="mx-5">
    <OrderTable :orders="orders" />
  </div>
</template>
