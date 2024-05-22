<script lang="ts" setup>
const truck = computed(() => useRoute().path.split('/')[3]);
const show = ref(false);

onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 100)
})

watch(truck, () => {
  show.value = false;

  setTimeout(() => {
    show.value = true
  }, 300)
})

</script>

<template>
  <Transition :key="truck" name="blur" :type="'transition'">
    <h1 v-if="show">{{ truck ?? "gkoakfg" }}</h1>
  </Transition>
</template>

<style lang="scss">
.blur-enter-active,
.blur-leave-active {
  transition: all 0.4s;
}

.blur-enter-from,
.blur-leave-to {
  opacity: 0;
  // transform: scale(0.8);
  filter: blur(0.5rem);
}
</style>
