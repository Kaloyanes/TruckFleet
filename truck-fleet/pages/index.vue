<script lang="ts" setup>
const { data, refresh } = await useFetch("/api/countries");


</script>


<template>
  <div>
    <ul>
      <li v-for="country in data" :key="country['id']">
        {{ country["name"] }}
      </li>
    </ul>

    <Button @click="refresh">Refresh</Button>

  </div>
</template>


<style>
</style>
