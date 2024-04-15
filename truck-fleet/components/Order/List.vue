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
  orders.value;
});

function selectOrder(select: boolean, order: any) {

  useState('selectedOrder').value = select ? order : null;

}

</script>

<template>
  <div>
    {{ ordersReactivity }}
    <ScrollArea class="w-[60vw]">

      <Table class="rounded-lg">
        <TableHeader>
          <TableRow>
            <TableCell>
              <Checkbox disabled class="rounded-[5px]" />
            </TableCell>
            <TableCell>
              Order Id
            </TableCell>
            <TableCell class="min-w-[250px]">
              Customer Company
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody class="rounded-lg">
          <TableRow v-for="order in [...orders, ...orders]" class="rounded-lg">
            <TableCell>
              <Checkbox class="rounded-[5px]" :checked="useState('selectedOrder').value === order"
                @update:checked="(val) => selectOrder(val, order)" />
            </TableCell>
            <TableCell>
              {{ order.id }}
            </TableCell>
            <TableCell>
              {{ order.customerCompanyRef.name }}
            </TableCell>
            <TableCell class="min-w-[250px]">
              {{ order.note }}
            </TableCell>
            <TableCell class="min-w-[100px]">
              {{ order.orderSum }} EUR
            </TableCell>
            <TableCell class="min-w-[300px]">
              <div v-for="location in (order.locations as Array<any>)" class="flex flex-col gap-2">
                <ol class="relative border-s border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                  <OrderShowLocationInfo :address="location.pickUpAddress" :time="location.pickUpTime" />
                  <OrderShowLocationInfo :address="location.deliveryAddress" :time="location.deliveryTime" />
                </ol>
              </div>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger>
                  <Button size="icon" variant="ghost">
                    <UIcon name="material-symbols:more-vert" size="20" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div class="flex flex-col gap-2">
                    <h1>KGOAKFSO</h1>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>

<style lang="scss"></style>
