<script setup lang='ts'>

const db = useFirestore();

const auth = useFirebaseAuth();

await auth?.authStateReady();

const {
  data: profile,
  promise
} = await useProfileDoc();

await promise.value;
let id = profile.value!.type === 'speditor' ? profile.value!.companyId : profile.value!.id;


// const {
//   data: trucks,
//   pending,
//   error
// } = useCollection(query(collection(db, 'trucks'), where('companyId', '==', id)));

const trucksStore = useTrucksStore();


// Create the links for every truck

const links = computed(() =>
  [
    {
      label: 'All',
      to: '/dashboard/orders/all'
    },
    ...trucksStore.unfilteredTrucks.map((truck: any) => ({
      label: truck.licensePlate,
      to: `/dashboard/orders/${truck.licensePlate}`
    })),

  ]
);
</script>

<template>
  <div>

    <!-- <div v-if="pending">Loading...</div>
    <div v-if="error">{{ error.message }}</div>

    <div v-if="!pending && !trucks.length">No trucks found</div> -->


    <UHorizontalNavigation :links />

  </div>
</template>
