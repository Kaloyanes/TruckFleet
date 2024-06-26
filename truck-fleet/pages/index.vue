<script lang="ts" setup>
let user = useCurrentUser();
</script>

<template>
  <div>
    <div class="sticky top-3">
      <LandingHeader />
    </div>
    <LandingHero />

    <!-- Position it to top right -->
    <!-- <div class="fixed right-4 top-4">
      <NuxtLink :to="user ? '/dashboard' : '/login'">
        <Button variant="outline">
          {{ user ? "Dashboard" : "Login" }}
        </Button>
      </NuxtLink>
    </div> -->
  </div>
</template>
