<template >
  <div class="flex flex-col gap-8">

    <a href="#" class="self-center" v-for="locale in availableLocales" :key="locale.code"
      @click.prevent.stop="setLocale(locale.code)">
      {{ locale.name }}
    </a>
    <UButton>
      Is Dark:
    </UButton>


  </div>
</template>

<script setup lang="ts">


const { locale, setLocale, locales } = useI18n();

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

</script>




