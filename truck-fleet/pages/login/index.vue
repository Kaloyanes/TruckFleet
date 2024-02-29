<script lang="ts" setup>

import * as yup from "yup";


// let email: string = "";
const email = useField<string>('email', yup.string().email().required());

const password = useField<string>('password', yup.string().min(8).required());
let maskPassword: Ref<boolean> = ref(false);





async function login() {

  var emailValid = await email.validate();
  var passwordValid = await password.validate();

  if (!emailValid.valid || !passwordValid.valid) {
    console.log("Invalid");

    return;
  }



  var auth = useSupabaseClient().auth;

  await auth.signInWithPassword({
    email: email.value.value.trim(),
    password: password.value.value.trim()
  }).catch((error) => {
    console.log(error);
  });


  const route = useRoute();

  navigateTo(route.query.redirect as string || "/dashboard")

}


</script>



<template>
  <div class="w-full flex justify-center items-center h-screen">
    <div class="flex flex-col p-8">
      <div class="rounded-3xl p-8 overflow-hidden gap-6 flex flex-col text-white bg-base-300">
        <div class="py-2">
          <h1 class="text-xl font-bold text-base-content">{{ $t("login") }}</h1>
        </div>
        <div class="flex flex-col">
          <!-- TODO: ENTER KEY TO SUBMIT -->
          <input class="input input-primary input-bordered text-white w-full rounded-full " type="text"
            v-model="email.value.value" :class="email.errorMessage.value !== undefined ? 'input-error' : ''" />
          <span class="text-xs text-error pt-3 capitalize" v-if="email.errorMessage.value !== undefined">{{
            email.errorMessage.value
          }}
          </span>
        </div>
        <div class="flex flex-col" v-auto-animate>

          <div class="flex relative w-full ">
            <input class="input input-primary input-bordered text-white w-full rounded-full "
              :type="maskPassword ? 'text' : 'password'" v-model="password.value.value" />

            <button class="btn btn-primary btn-circle absolute right-0" @click="() => maskPassword = !maskPassword">
              <Icon :name="!maskPassword ? 'fluent:eye-16-filled' : 'fluent:eye-off-16-filled'" size="30" color="white" />
            </button>
          </div>

          <span class="text-xs text-error pt-3 capitalize" v-if="password.errorMessage.value !== undefined">{{
            password.errorMessage.value }}</span>
        </div>
        <button @click="login" class="self-center btn w-full btn-primary text-white ">{{ $t("login") }}</button>
      </div>


    </div>
  </div>
</template>


