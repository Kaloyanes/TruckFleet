<script lang="ts" setup>
import { Loader } from '@googlemaps/js-api-loader';
import { CustomMarker, GoogleMap, Polyline } from 'vue3-google-map';


const props = defineProps({
  apiKey: {
    type: String,
    required: true
  },
  lastOrder: {
    required: true
  }
})


const loader = new Loader({
  apiKey: props.apiKey,
  version: 'weekly',
  libraries: ['places', 'geometry'],
});

let geometry = await loader.importLibrary('geometry');




// https://routes.googleapis.com/directions/v2:computeRoutes
const info = {
  "origin": {
    "address": (props.lastOrder as any).locations[0].pickUpAddress,
  },
  "destination": {
    "address": (props.lastOrder as any).locations[0].deliveryAddress,
  },
  "travelMode": "DRIVE",
  "routingPreference": "TRAFFIC_AWARE",
  "computeAlternativeRoutes": false,
  "routeModifiers": {
    "avoidTolls": false,
    "avoidHighways": false,
    "avoidFerries": false
  },
  "languageCode": "en-US",
  "units": "METRIC"
}

const { data: routes, pending: routesPending } = useFetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
  method: 'POST',
  body: info,
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": props.apiKey,
    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline,routes.legs.polyline,routes.legs.steps.polyline"
  },
})

const center = ref<{ lat: number, lng: number } | null>(null);


const routePolyline = computed(() => {
  if (routes.value === null) return {};

  const steps = (routes.value as any).routes[0].legs[0].steps;
  console.log("routes", geometry.encoding.decodePath(steps[steps.length - 1].polyline.encodedPolyline)[0].lat());

  center.value = {
    lat: geometry.encoding.decodePath(steps[steps.length - 1].polyline.encodedPolyline)[0].lat(),
    lng: geometry.encoding.decodePath(steps[steps.length - 1].polyline.encodedPolyline)[0].lng(),
  }

  return {
    path: geometry.encoding.decodePath((routes.value as any).routes[0].polyline.encodedPolyline),
    geodesic: true,
    strokeColor: '#5A32B4',
    strokeOpacity: 1,
    strokeWeight: 3,
  }
})





</script>

<template>
  <GoogleMap v-if="!routesPending" :api="apiKey" style="height: 105vh;  border: 0px;" background-color="transparent"
    :center="center" :zoom-control="false" :map-type-control="false" :street-view-control="false"
    :fullscreen-control="false" :zoom="13" :min-zoom="3" :max-zoom="13.9" map-id="b514deccd04f2a38">

    <template #default="{ map, api, ready, mapTilesLoaded }">
      <CustomMarker :options="{ position: center, anchorPoint: 'BOTTOM_CENTER' }">
        <div style="text-align: center"
          class="bg-primary h-full w-full flex flex-col justify-center items-center rounded-full p-1    relative">
          <UIcon size="15" name="ic:baseline-location-on" color="#000" />
          <div class="p-4 -z-10 bg-primary/50 absolute rounded-full"></div>
        </div>
      </CustomMarker>

      <Polyline :options="routePolyline" />
    </template>
  </GoogleMap>

  <div v-else class="h-full w-full bg-[17,17,17] rounded-xl flex justify-center align-center">
    <h1 class="text-center text-3xl font-sans">Loading maps</h1>
  </div>

</template>

<style lang="scss"></style>
