<script lang="ts" setup>

const props = defineProps({
  licensePlate: {
    type: String,
    required: true
  }
})

const { orders, ordersPromise } = await useOrders(props.licensePlate);

await ordersPromise.value;
const ordersReactivity = computed(() => {
  // TODO: REMOVE THIS
  orders.value;
})
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
