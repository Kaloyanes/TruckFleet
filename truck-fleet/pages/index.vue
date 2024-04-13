<script lang="ts" setup>
let user = useCurrentUser();

</script>

<template>
  <div>
    <!-- Position it to top right -->
    <div class="fixed right-4 top-4">
      <NuxtLink :to="user ? '/dashboard' : '/login'">
        <UButton :key="user">
          {{ user ? 'Dashboard' : 'Login' }}
        </UButton>
      </NuxtLink>
    </div>

  </div>
</template>
