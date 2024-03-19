<script setup lang='ts'>
import { collection, query, where } from 'firebase/firestore';

const db = useFirestore();

const auth = useFirebaseAuth();

await auth?.authStateReady();

const {
  data: profile,
  promise
} = await useProfileDoc();

await promise;
let id = profile.value!.type === 'speditor' ? profile.value!.companyId : profile.value!.id;


const {
  data: trucks,
  pending,
  error
} = useCollection(query(collection(db, 'trucks'), where('companyId', '==', id)));

// Create the links for every truck

const links = computed(() => trucks.value?.map((truck: any) => ({
  label: truck.licensePlate,
  to: `/dashboard/orders/${truck.licensePlate}`
})));
</script>

<template>
  <div>

    <div v-if="pending">Loading...</div>
    <div v-if="error">{{ error.message }}</div>

    <div v-if="!pending && !trucks.length">No trucks found</div>

    <UHorizontalNavigation :links>

    </UHorizontalNavigation>
  </div>
</template>
