<script lang="ts" setup>

</script>

<template>
  <div class="z-[99999999]">

    <CommandPallete />
  </div>

  <div class="flex w-screen">
    <DashboardNavigation />

    <div class="flex-[1] ">
      <slot />
    </div>
  </div>
</template>
