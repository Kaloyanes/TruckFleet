<script lang="ts" setup>
const isOpen = computed(() => useRouter().currentRoute.value.hash === '#editTruck')

const truck = computed(() => useRoute().query.license?.toString() || useRoute().params.license as string)
</script>

<template>
  <Sheet :open="isOpen" @update:open="(e: any) => useRouter().back()">

    <SheetContent>
      <h1>Edit Truck</h1>
    </SheetContent>
  </Sheet>
</template>

<style lang="scss"></style>
