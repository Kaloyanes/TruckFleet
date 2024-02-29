<template >
  <div class="flex flex-col gap-8">

    <a href="#" class="self-center" v-for="locale in availableLocales" :key="locale.code"
      @click.prevent.stop="setLocale(locale.code)">
      {{ locale.name }}
    </a>
    <button @click="toggleDark()">
      Is Dark: {{ isDark }}
    </button>
  </div>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)
const { locale, setLocale, locales } = useI18n();

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

</script>




