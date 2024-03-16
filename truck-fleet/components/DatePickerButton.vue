<script setup lang="ts">
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';


// const date = ref(Date.now());


const props = defineProps({
  modelValue: {
    type: Timestamp,
    default: null
  },
  range: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:model-value'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
  }
})
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton icon="i-heroicons-calendar-days-20-solid"
      :label="format(new Date((date as Timestamp).toMillis()), 'd/MM/yyyy HH:mm')" />

    <template #panel="{ close }">
      <DatePicker v-model="date" @close="close" />
    </template>
  </UPopover>
</template>
