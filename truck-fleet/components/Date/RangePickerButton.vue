<script setup lang="ts">
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

const props = defineProps({
  modelValue: {
    type: new Object() as () => {
      start: Timestamp,
      end: Timestamp
    },
    default: null
  },

})

const emit = defineEmits(['update:model-value'])

const formattedDateStart = ref<Date>(new Date(Date.now.toString()))

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
  }
})
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid" block>
      {{ format(date.start.toDate(), "dd.MM.yyyy HH:mm") }} - {{ format(date.end.toDate(), "dd.MM.yyyy HH:mm") }}
    </UButton>

    <template #panel="{ close }">
      <DateRangePicker v-model="date" />
    </template>
  </UPopover>
</template>
