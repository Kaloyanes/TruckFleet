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




</script>

<template>
  <div class="mx-5">
    <OrderTable :order-query="modifiedQuery(orderRef)" />
  </div>
</template>
