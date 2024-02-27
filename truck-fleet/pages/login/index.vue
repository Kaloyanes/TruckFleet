<script lang="ts" setup>


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
  <div class="w-full flex flex-col justify-center">
    <input type="text" v-model="email" />
    <input type="password" v-model="password" />

    <button @click="login">Login</button>
  </div>
</template>


<style>
</style>
