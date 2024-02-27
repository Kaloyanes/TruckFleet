<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})


async function login() {

  console.log(email.trim(), password.trim());

  if (email.trim() === "" || password.trim() === "") {
    alert("Please fill in all fields");
    return;
  }

  var auth = useSupabaseClient().auth;

  await auth.signInWithPassword({
    email: email.trim(),
    password: password.trim()
  }).catch((error) => {
    console.log(error);
  });


  const route = useRoute();

  navigateTo(route.query.redirect as string || "/dashboard")

}
</script>


<script lang="ts">
let email = "";
let password = "";
</script>

<template>
  <div class="w-full flex justify-center items-center h-screen">
    <div class="w-1/4 flex flex-col p-8 bg-slate-400 rounded-2xl">

      <input type="text" v-model="email" />
      <input type="password" v-model="password" />

      <Button @click="login" class="w-1/3 self-center">Login</Button>
    </div>
  </div>
</template>


<style>
</style>
