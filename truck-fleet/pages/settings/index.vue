<template>
  <button @click="toggleDark()">
    Is Dark: {{ isDark }}
  </button>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)


</script>




