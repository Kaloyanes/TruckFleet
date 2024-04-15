<script lang="ts" setup>

import { format } from 'date-fns';

const props = defineProps({
  dates: {
    type: Object,
    required: true,
  },
})

function checkDates(date: Date) {
  const currentTime = new Date();
  currentTime.setMinutes(0);
  currentTime.setSeconds(0);

  return currentTime.toLocaleString() === date.toLocaleString();
}

</script>

<template>
  <TableBody>
    <TableRow v-for="(info, index) in  dates " ref="currentDateRefElement" v-memo="[dates, info.order]"
      class="divide-x-2" :class="(info.order?.isDone) ? 'bg-green-400 bg-opacity-20' : ''" :key="index">
      <TableCell class="font-medium transition-all duration-700 text-center" :data-date="info.date.toLocaleString()"
        :class="{ 'current-date': checkDates(info.date) }">
        {{ format(info.date, "dd/MM/yyyy") }}
      </TableCell>

      <TableCell class="font-medium transition-all duration-700 text-center" :data-date="info.date.toLocaleString()"
        :class="{ 'current-date': checkDates(info.date) }">
        {{ format(info.date, "HH:mm") }}
      </TableCell>

      <TableCell>
        {{ info.order?.id }}
      </TableCell>

      <TableCell>
        {{ info.order?.licensePlate }}
      </TableCell>
      <TableCell>
        {{ info.order?.driver ?? '' }}
      </TableCell>

      <TableCell>
        {{ info.orderType ?? '' }}
      </TableCell>

      <TableCell>
        {{ info.orderAddress ?? '' }}
      </TableCell>

      <TableCell>
        {{ info.customerCompany?.name ?? '' }}
      </TableCell>

      <TableCell>
        {{ info.order?.worker ?? '' }}
      </TableCell>

      <TableCell>
        {{ info.order?.orderId ?? '' }}
      </TableCell>

      <TableCell class="w-[170px]">
        {{ info.order?.weight ? `${info.order?.weight} kg` : '' }}
      </TableCell>

      <TableCell>
        {{ info.order?.orderSize }}
      </TableCell>

      <TableCell>
        {{ info.order?.orderSum ? `${info.order?.orderSum} €` : '' }}
      </TableCell>

      <TableCell>
        <div class="flex flex-col justify-center items-center gap-2 h-full">
          <div v-for="document in info.order?.documents">
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
          {{ info.order?.note }}
        </div>
      </TableCell>

      <TableCell class="">
        <div class="h-max text-transparent flex justify-center items-center">
          <UCheckbox v-if="info.order" v-model="info.order.isDone" class="m-0" />
          <div v-else>.</div>
        </div>
      </TableCell>

    </TableRow>

  </TableBody>

</template>

<style lang="scss"></style>
