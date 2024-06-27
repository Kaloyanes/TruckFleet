<script lang="ts" setup>
function goToSection(id: string) {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth" });
}

onMounted(() => {
  animate(
    ".link-button",
    {
      y: [-50, 0],
      scale: [0.6, 1.1, 1],
      opacity: [0, 1],
      filter: ["blur(15px)", "blur(0px)"],
    },
    {
      delay: stagger(0.07, {
        start: 0.3,
      }),
      easing: spring({
        damping: 15,
        stiffness: 100,
        mass: 0.7,
      }),
    },
  );
});
</script>

<template>
  <div class="absolute top-3 flex w-full justify-center">
    <Motion
      class="flex-[0.7]"
      :initial="{
        scale: 0.5,
        opacity: 0,
        y: -150,
        filter: 'blur(15px)',
      }"
      :animate="{
        scale: 1,
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }"
      :transition="{
        easing: spring({
          damping: 15,
          stiffness: 100,
          mass: 0.5,
        }),
      }"
      :tag="'header'"
    >
      <div
        class="flex h-16 select-none items-center justify-between gap-3 overflow-hidden rounded-lg border border-white/15 bg-gray-900/50 px-2 shadow-lg shadow-white/20 backdrop-blur-xl"
      >
        <NuxtImg src="/logo-dark.svg" alt="Truck Fleet Logo" />
        <Button class="link-button" variant="link">Product</Button>
        <Button class="link-button" variant="link">Pricing</Button>
        <Button class="link-button" variant="link">About</Button>
        <div class="flex flex-1 items-center justify-end gap-3">
          <NuxtLink href="/login" as-child>
            <Button variant="outline">Get Started</Button>
          </NuxtLink>
        </div>
      </div>
    </Motion>
  </div>
</template>

<style lang="scss"></style>
