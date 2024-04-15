<script lang="ts" setup>
import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

const props = defineProps({
  time: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: true
  }
})

const time = props.time;
const address = props.address;


</script>

<template>
  <li class="ms-4 flex flex-col gap-2">
    <circle
      class="absolute w-3 h-3 bg-gray-200 rounded-full -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
    </circle>
    <time class="text-sm font-normal leading-none text-gray-400 dark:text-gray-500 flex gap-1 flex-nowrap">
      <div>{{ format((time.start as Timestamp).toDate(), "dd MMM | HH:00") }} </div>
      <div v-if="(time.end as Timestamp).seconds !== (time.start as
        Timestamp).seconds">-
        {{ format((time.end as Timestamp).toDate(), "dd MMM | HH:00") }}
      </div>
    </time>
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ address }}
    </h3>
  </li>
</template>

<style lang="scss"></style>
