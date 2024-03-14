<script lang="ts" setup>
let user2 = useCurrentUser();
</script>

<template>
  <div>
    <h1>Welcome</h1>
    <h2>{{ user2?.email }}</h2>
  </div>
</template>

<style lang="scss"></style>
