<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
})

const truck = reactive({
  licensePlate: props.modelValue?.licensePlate || '',
  model: props.modelValue?.model || '',
  year: props.modelValue?.year || '',
  capacity: props.modelValue?.capacity || '',
  status: props.modelValue?.status || '',
  location: props.modelValue?.location || '',
})

watch(truck, (newTruck, oldTruck) => {
  emit('update:truck', newTruck)
})

const emit = defineEmits(['update:truck', 'submit:edit'])

const maxYear = new Date().getFullYear() + 1;

const formSchema = z.object({
  model: z.string(),
  licensePlate: z.string().min(4, 'Invalid License Plate'),
  year: z.number().min(1900, 'Year must be greater than 1900').max(maxYear, `Year must be less than ${maxYear}`),
  status: z.enum(['Available', 'In Loading', 'On Route', 'Delivered', 'Damaged']),
  capacity: z.number().min(1, 'Capacity must be greater than 0'),
})

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: truck,
})

function submit(data: any) {
  console.log("submitted")
  data.id = props.modelValue?.id ?? '';
  emit('submit:edit', data)
}
</script>

<template>
  <div class="relative h-full">
    <!-- <Label :for="">FASFLP</Label>
    <Input placeholder="License Plate" v-model="truck.licensePlate" /> -->
    <AutoForm :schema="formSchema" :form="form" @submit="(e) => submit(e)" :field-config="{
      capacity: {
        inputProps: {
          placeholder: 'Capacity in kgs',
        },
      }
    }">
      <div class="sticky bottom-3 flex justify-around w-full px-8 gap-3 pt-5">

        <SheetClose as-child>
          <Button variant="outline" class="flex-[1] w-full">Cancel</Button>
        </SheetClose>

        <SheetClose as-child>
          <Button type="submit" class="flex-[1] w-full">Confirm Changes</Button>
        </SheetClose>
      </div>
    </AutoForm>
  </div>
</template>

<style lang="scss"></style>
