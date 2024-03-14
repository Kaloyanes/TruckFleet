<script lang="ts" setup>

let route = useRoute();


const isVisible = ref(route.query.add === 'true');


</script>

<template>
  <div>
    <UButton @click="isVisible = true">Add Order</UButton>

    <UModal v-model="isVisible">
      <div>
        <h1>Add Order</h1>
        <UButton @click="isVisible = false">Close</UButton>
      </div>
    </UModal>
  </div>
</template>
