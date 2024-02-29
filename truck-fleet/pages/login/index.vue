

<template>
  <div class="w-full flex justify-center items-center h-screen">
    <div class="flex flex-col p-8">
      <div class="rounded-3xl p-8 overflow-hidden gap-6 flex flex-col text-white bg-base-300">
        <div class="py-2">
          <h1 class="text-xl font-bold">{{ $t("login") }}</h1>
        </div>
        <input class="input input-primary input-bordered text-white w-full rounded-full " type="text" v-model="email" />

        <div class="flex relative w-full ">
          <input class="input input-primary input-bordered text-white w-full rounded-full "
            :type="maskPassword ? 'text' : 'password'" v-model="password" />
          <button class="btn btn-primary btn-circle absolute right-0" @click="() => maskPassword = !maskPassword">
            <span class="text-black p-2">
              <img class="stroke-white fill-white"
                :src="maskPassword ? '/eye-slash-svgrepo-com.svg' : '/eye-svgrepo-com.svg'" height="25" />

            </span>
          </button>
        </div>
        <button @click="login" class="self-center btn w-full btn-primary text-white">{{ $t("login") }}</button>
      </div>


    </div>
  </div>
</template>


<script lang="ts" setup>
definePageMeta({
})

let email: string = "";
let password: string = "";
let maskPassword: Ref<boolean> = ref(false);

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

