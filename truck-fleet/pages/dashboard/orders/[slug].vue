<script setup lang="ts">
let slug = useRoute().params.slug;

</script>

<template>
  <div>
    <h1>Order Details</h1>
    <p>Slug: {{ slug }}</p>

    <div class="overflow-x-scroll flex-1 max-w-[84vw] lg:max-w-[83.3vw]  ">

      <OrderTable />
    </div>
  </div>
</template>
