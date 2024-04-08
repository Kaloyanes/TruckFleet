<script lang="ts" setup>
let user = useCurrentUser();

</script>

<template>
  <div>
    <h1>Hello Truck Fleet</h1>
    <h1>Welcome</h1>

    <Transition>
      <NuxtLink :to="user ? '/dashboard' : '/login'">
        <UButton :key="user">
          {{ user ? 'Dashboard' : 'Login' }}
        </UButton>
      </NuxtLink>
    </Transition>
  </div>
</template>
