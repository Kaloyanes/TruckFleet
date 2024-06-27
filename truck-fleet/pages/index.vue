<script lang="ts" setup>
let user = useCurrentUser();
</script>

<template>
  <div>
    <div class="sticky top-3">
      <LandingHeader />
    </div>

    <LandingHero />
    <LandingProduct />
    <LandingPricing />
  </div>
</template>
