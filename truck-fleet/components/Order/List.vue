<script lang="ts" setup>
import type { Query } from 'firebase/firestore';
import { collection, query, where } from 'firebase/firestore';

const props = defineProps({
  licensePlate: {
    type: String,
    required: true
  }
})

const db = useFirestore();


const {
  data: profile,
  promise: profilePromise,
} = useProfileDoc()

await profilePromise.value;

let id = profile.value?.type === 'company' ? profile.value?.id : profile.value?.companyId;



const orderRef = query(collection(db, 'orders'), where('companyId', '==', id));
const filteredQuery = (ordersQuery: Query) => {
  return props.licensePlate === 'all'
    ? ordersQuery
    : query(ordersQuery, where('licensePlate', '==', props.licensePlate));
};

const { data: orders, promise: ordersPromise } = useCollection(filteredQuery(orderRef));

await ordersPromise.value;

const ordersReactivity = computed(() => {
  return orders.value;
});

</script>

<template>
  <div>
    {{ ordersReactivity }}
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>
            <Checkbox disabled class="rounded-[5px]" />
          </TableCell>
          <TableCell>
            Order Id
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="order in orders" class="rounded-lg">
          <TableCell>
            <Checkbox class="rounded-[5px]" />
          </TableCell>
          <TableCell>
            {{ order.id }}
          </TableCell>
          <TableCell>
            {{ order.customerCompanyRef.name }}
          </TableCell>
          <TableCell>
            {{ order.note }}
          </TableCell>
          <TableCell>
            {{ order.orderSum }}
          </TableCell>
          <TableCell>
            {{ (order.locations as Array<Object>).join(', ') }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="scss"></style>
