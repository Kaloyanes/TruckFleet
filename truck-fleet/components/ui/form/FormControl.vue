<script lang="ts" setup>
import { Slot } from 'radix-vue';
import { useFormField } from './useFormField';

const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
</script>

<template>
  <Slot :id="formItemId" :aria-describedby="!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`"
    :aria-invalid="!!error" class="transition-all data-[state=invalid]:animate-shake">
    <slot />
  </Slot>
</template>
