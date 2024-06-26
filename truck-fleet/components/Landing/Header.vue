<script lang="ts" setup></script>

<template>
  <div class="absolute flex w-full justify-center">
    <div
      class="flex w-1/2 items-center justify-between gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 p-5 shadow-lg shadow-neutral-900/50 backdrop-blur-md"
    >
      <NuxtLink to="/" as-child>
        <div class="flex flex-1 items-center gap-3">
          <img
            :src="
              $colorMode.value === 'dark' ? '/lightFavicon.svg' : '/favicon.svg'
            "
            alt="Truck Fleet"
          />
          <h1 class="text-lg font-bold tracking-wider">Truck Fleet</h1>
        </div>
      </NuxtLink>
      <div class="gap-2ab flex">
        <NuxtLink href="#about">
          <Button variant="link">About</Button>
        </NuxtLink>
        <NuxtLink href="#pricing">
          <Button variant="link">Pricing</Button>
        </NuxtLink>
        <NuxtLink href="#pricing">
          <Button variant="link">Pricing</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
