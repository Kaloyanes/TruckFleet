<script lang="ts" setup>

</script>

<template>
  <CommandPallete />

  <div class="flex w-screen">
    <DashboardNavigation />

    <div class="flex-[1] ">
      <slot />
    </div>
  </div>
</template>
