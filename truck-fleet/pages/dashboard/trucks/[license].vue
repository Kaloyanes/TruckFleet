<script lang="ts" setup>
import { GoogleMap } from 'vue3-google-map';
const config = useRuntimeConfig();
const licensePlate = computed(() => useRoute().params.license);
useSeoMeta({
  titleTemplate: `%s - ${licensePlate.value}`,
})

// CHANGE API KEY TO TRUCK FLEET PROJECT INSTEAD OF FLEET
const apiKey = config.public.google_maps;
console.log(apiKey)

const center = { lat: 40.689247, lng: -74.044502 }
</script>

<template>
  <div class="overflow-hidden min-w-0 w-full rounded-xl ">

    <GoogleMap :api-key="apiKey" style="height: 105vh; border: 0px;" :center="center" :disable-default-ui="true"
      :zoom="15" :max-zoom="17" map-id="b514deccd04f2a38">
    </GoogleMap>
  </div>
</template>

<style lang="scss"></style>
