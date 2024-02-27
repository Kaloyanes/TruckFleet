<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})

async function signOut() {
  const auth = useSupabaseClient().auth;

  await auth.signOut();

  navigateTo("/login");
}
</script>

<template>
  <div>
    <h1>Dashboard</h1>

    <Button @click="signOut">Sign Out</Button>

  </div>
</template>


<style>
</style>
