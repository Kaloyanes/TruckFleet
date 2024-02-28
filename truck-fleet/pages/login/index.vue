

<template>
  <div class="w-full flex justify-center items-center h-screen">
    <div class="flex flex-col p-8">
      <Card class="rounded-3xl bg-opacity-55 backdrop-blur-xl text-white bg-primary">
        <CardHeader>
          <CardTitle>Login into Truck Fleet</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col justify-center items-center gap-4">
          <input class="input input-primary input-bordered text-white w-full rounded-full " type="text" v-model="email" />

          <div class="flex relative w-full ">
            <input class="input input-primary input-bordered text-white w-full rounded-full "
              :type="maskPassword ? 'text' : 'password'" v-model="password" />
            <button class="btn btn-primary btn-circle absolute right-0" @click="() => maskPassword = !maskPassword">
              <span class="text-black p-2">
                <img :src="maskPassword ? '/eye-slash-svgrepo-com.svg' : '/eye-svgrepo-com.svg'" height="25" />

              </span>
            </button>
          </div>
        </CardContent>
        <CardFooter class="justify-center ">
          <button @click="login" class="self-center btn w-full btn-primary text-white">Login</button>
        </CardFooter>
      </Card>


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

