<script lang="ts" setup></script>

<template>
  <div
    class="flex h-screen flex-col items-center space-y-4 bg-gradient-to-br from-background via-purple-800/30 via-75% to-background p-24 pt-32"
  >
    <div class="w-8/12 space-y-2 text-center">
      <h1 class="text-6xl font-bold">
        Streamline Your Truck Management Operations
      </h1>
      <h2 class="text-2xl font-medium">
        Efficiently manage your fleet, orders, and drivers with our all-in-one
        truck management software.
      </h2>
    </div>
    <Button variant="default" class="flex w-32 gap-2"
      >Get Started
      <Icon name="material-symbols:arrow-circle-right-outline" size="20" />
    </Button>
    <div class="flex-1">
      <NuxtImg
        src="/images/hero.png"
        format="webp"
        alt="Truck Fleet"
        class="mt-6 rounded-xl"
      />
    </div>
  </div>
</template>

<style lang="scss"></style>
