<script lang="ts" setup>
const selectedOrder = useState<any | null>('selectedOrder', () => null)
</script>

<template>
  <div>
    <h1 class="text-xl font-light">Selected Route</h1>
    <div v-if="selectedOrder">
      {{ selectedOrder.id }}
    </div>
  </div>
</template>

<style lang="scss"></style>
