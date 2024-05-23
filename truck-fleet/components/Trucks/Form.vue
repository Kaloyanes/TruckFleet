<script lang="ts" setup>
import * as z from 'zod';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
})

const truck = reactive({
  licensePlate: props.modelValue?.licensePlate || '',
  make: props.modelValue?.make || '',
  model: props.modelValue?.model || '',
  year: props.modelValue?.year || '',
  capacity: props.modelValue?.capacity || '',
  status: props.modelValue?.status || '',
  location: props.modelValue?.location || '',
})

watch(truck, (newTruck, oldTruck) => {
  console.log('New truck data:', newTruck)
  console.log('Old truck data:', oldTruck)
  emit('update:truck', newTruck)
})

const emit = defineEmits(['update:truck'])

const formSchema = z.object({
  username: z.string().describe('Your username'),
  someValue: z.string(), // Will be "Some Value"
})
</script>

<template>
  <div>
    <!-- <Label :for="">FASFLP</Label>
    <Input placeholder="License Plate" v-model="truck.licensePlate" /> -->
    <!-- <AutoForm :schema="formSchema" /> -->
  </div>
</template>

<style lang="scss"></style>
