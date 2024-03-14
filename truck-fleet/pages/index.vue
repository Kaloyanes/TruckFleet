<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})

let user2 = useCurrentUser();

</script>

<template>
  <div>
    <h1 class="text-">faksjiod</h1>

    <h1 class="text-">{{ user2?.email }}</h1>
  </div>
</template>
