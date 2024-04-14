<script lang="ts" setup>

import { collection, query, where } from 'firebase/firestore';

const route = useRoute();


const licensePlate = route.params.licensePlate;

console.log(licensePlate);
const db = useFirestore();

const companyId = await useCompanyId();

const orderRef = query(collection(db, 'orders'), where('companyId', '==', companyId.value));
const modifiedQuery = (ref: any) => {
  if (licensePlate === 'all') {
    return ref;
  }
  return query(ref, where('licensePlate', '==', licensePlate));
};
</script>

<template>
  <div>
    <OrderList :license-plate="licensePlate as string" />
  </div>
</template>
