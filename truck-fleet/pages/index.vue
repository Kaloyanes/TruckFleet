<template>
  <div class="h-full">
    <a href="#" v-for="locale in availableLocales" :key="locale.code" @click.prevent.stop="setLocale(locale.code)">
      {{ locale.name }}
    </a>

    <p class="mt-5">{{ $t("welcome") }}</p>
  </div>
</template>


<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})

const { locale, setLocale, locales } = useI18n();

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

</script>

