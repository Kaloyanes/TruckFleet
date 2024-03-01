

<template>
  <div>
    <h1>Dashboard</h1>

    <button @click="signOut">Sign Out</button>

  </div>
</template>


<style>
</style>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
  pageTransition: { name: 'fade', mode: 'out-in' }
})

async function signOut() {
  const auth = useSupabaseClient().auth;

  await auth.signOut();

  const router = useRouter();

  router.push('/');
}
</script>
