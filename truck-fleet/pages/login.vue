<script lang="ts" setup>
definePageMeta({
  middleware: 'login'
})

import { signInWithEmailAndPassword } from '@firebase/auth';
import * as yup from 'yup';

useSeoMeta({
  titleTemplate: '%s - Login',
})

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

type Schema = yup.InferType<typeof schema>;

const state = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isSubmitting: false,
  errors: {} as Partial<Schema>,
});

const errorMessage = ref<string | undefined>(undefined);

const maskPassword = ref<boolean>(true);

let auth = useFirebaseAuth();

async function login() {
  if (!schema.validateSync(state)) {

    return;
  }

  await auth?.authStateReady();

  if (auth === null) {
    errorMessage.value = 'An error occurred while trying to login. Please try again later.';
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, state.email, state.password);
  } catch (error: any) {
    errorMessage.value = error.message;
    return;
  }

  await navigateTo('/', { replace: true });
}

</script>

<template>
  <div class="flex justify-center items-center h-screen relative">
    <div class="w-52 h-52 aspect-square rounded-full dark:bg-zinc-600 bg-zinc-950  absolute blur-2xl"></div>
    <UCard
      class="flex flex-col backdrop-opacity-100 backdrop-blur-2xl bg-zinc-300/25 dark:bg-zinc-800/25 rounded-xl border  border-zinc-900 dark:border-zinc-600 w-1/2 md:w-2/6 xl:w-1/6  ">
      <div class="flex flex-col items-center">
        <Icon :name="'fluent:person-24-filled'" size="50" class="self-center " />
        <h1 class="text-2xl font-bold ">Login</h1>
      </div>

      <UDivider class="py-3" />

      <UForm @submit.prevent="login" :schema="schema" :state="state">
        <div class="gap-3 flex flex-col ">
          <div v-auto-animate>
            <UAlert icon="i-heroicons-exclamation-circle-solid" :title="errorMessage" v-if="errorMessage !== undefined"
              variant="subtle" color="red" class="text-left" />
          </div>

          <UFormGroup label="Email" name="email" required>
            <UInput v-model="state.email" placeholder="Email"
              :color="state.errors.email !== undefined ? 'red' : 'primary'" class="caret-primary" size="xl" />
            <template #error="{ error }">
              <span :class="[error ? 'text-red-500 dark:text-red-400' : 'text-primary-500 dark:text-primary-400']"
                class="capitalize" v-if="error">
                {{ error }}
              </span>
            </template>
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UButtonGroup size="xl">
              <UInput placeholder="Password" v-model="state.password" :type="maskPassword ? 'password' : 'text'"
                class="rounded-r-none caret-primary" :ui="{ rounded: 'rounded-r-none' }"
                :color="state.errors.password !== undefined ? 'red' : 'primary'" />

              <UButton variant='soft' class="rounded-l-none" @click.prevent="maskPassword = !maskPassword">
                <Icon :name="!maskPassword ? 'fluent:eye-16-filled' : 'fluent:eye-off-16-filled'" size="23" />
              </UButton>
            </UButtonGroup>

            <template #error="{ error }">
              <span :class="[error ? 'text-red-500 dark:text-red-400' : 'text-primary-500 dark:text-primary-400']"
                class="capitalize" v-if="error">
                {{ error }}
              </span>
            </template>
          </UFormGroup>

        </div>
      </UForm>

      <UDivider class="py-3" />

      <div class="flex flex-col justify-center gap-3">
        <UButton color="primary" variant="solid" size="lg" block @click.prevent="login">Login</UButton>

        <NuxtLink to="/register">
          <UButton color="primary" variant="outline" size="lg" block>Register</UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
