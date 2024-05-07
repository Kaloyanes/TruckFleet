<script lang="ts" setup>

const props = defineProps({
  licensePlate: {
    type: String,
    required: true
  }
})


const orders = useOrdersStore();
await orders.init();

orders.filterByLicensePlate(props.licensePlate);



function selectOrder(select: boolean, order: any) {
  useState('selectedOrder').value = select ? order : null;
}


</script>

<template>
  <Table class="rounded-lg w-full">
    <TableHeader>
      <TableRow>
        <TableCell>
          <Checkbox disabled class="rounded-[5px]" />
        </TableCell>


        <TableCell>
          Order Id
        </TableCell>

        <TableCell class="min-w-[120px]">
          Truck
        </TableCell>

        <TableCell class="min-w-[150px]">
          Driver
        </TableCell>

        <TableCell class="min-w-[300px]">
          Locations
        </TableCell>

        <TableCell>
          Weight
        </TableCell>

        <TableCell>
          Size
        </TableCell>

        <TableCell>
          Salary
        </TableCell>

        <TableCell class="min-w-[250px]">
          Customer Company
        </TableCell>

        <TableCell>
          Documents
        </TableCell>

        <TableCell class="min-w[250px]">
          Note
        </TableCell>

        <TableCell>
          Status
        </TableCell>

        <TableCell>
          Actions
        </TableCell>

      </TableRow>
    </TableHeader>
    <TableBody class="rounded-lg">
      <TableRow v-for="order in orders.companyOrders" class="rounded-lg">
        <TableCell>
          <Checkbox class="rounded-[5px]" :checked="useState('selectedOrder').value === order"
            @update:checked="(val: boolean) => selectOrder(val, order)" />
        </TableCell>


        <TableCell>
          {{ order?.id }}
        </TableCell>

        <TableCell class="align-middle">
          <Icon name="bx:bxs-truck" size="25" />
          {{ order?.licensePlate }}
        </TableCell>

        <TableCell>
          {{ order?.driver ?? '' }}
        </TableCell>

        <TableCell>
          <div v-for="location in (order.locations as Array<any>)  " class="flex flex-col gap-2">
            <ol class="relative border-s border-gray-200 dark:border-gray-700 flex flex-col gap-3">
              <OrderShowLocationInfo :address="location.pickUpAddress" :time="location.pickUpTime" />
              <OrderShowLocationInfo :address="location.deliveryAddress" :time="location.deliveryTime" />
            </ol>
          </div>
        </TableCell>



        <TableCell class="w-[170px]">
          {{ order?.weight ? `${order?.weight} kg` : '' }}
        </TableCell>

        <TableCell>
          {{ order?.orderSize }}
        </TableCell>

        <TableCell>
          {{ order?.orderSum ? `${order?.orderSum} €` : '' }}
        </TableCell>

        <TableCell class="h-max align-middle">
          <HoverCard>
            <HoverCardTrigger>
              <div class="h-full">
                {{ order.customerCompanyRef?.name ?? '' }}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="flex flex-col gap-2">
                <div class="text-center">
                  Company Info
                </div>
                <UDivider class="py-2" />

                <h1><strong>Order ID: </strong> {{ order?.orderId }}</h1>
                <h1><strong>Worker: </strong> {{ order?.worker }}</h1>
              </div>
            </HoverCardContent>
          </HoverCard>
        </TableCell>

        <TableCell>
          <div class="flex flex-col justify-center items-center gap-2 h-full">
            <div v-for="document in order?.documents">
              <a :href="document.link" target="_blank" size="xs" variant="outline" class="m-0">
                <Button size="sm" variant="outline" class="m-0">
                  {{ document.name }}
                </Button>
              </a>
            </div>
          </div>
        </TableCell>

        <TableCell class="max-h-52">
          <div class="w-[150px] text-ellipsis">
            {{ order?.note }}
          </div>
        </TableCell>

        <TableCell class="">
          <div class="h-max text-transparent flex justify-center items-center">
            <UCheckbox v-if="order" v-model="order.isDone" class="m-0" />
            <div v-else>.</div>
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
</template>

<style lang="scss"></style>
