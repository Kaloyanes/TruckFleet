<script lang="ts" setup>
import { Loader } from '@googlemaps/js-api-loader';
import type { DocumentData } from 'firebase/firestore';
import { CustomMarker, GoogleMap, Polyline } from 'vue3-google-map';


const config = useRuntimeConfig();
const licensePlate = computed(() => useRoute().params.license);
useSeoMeta({
  titleTemplate: `%s - ${licensePlate.value}`,
})

// CHANGE API KEY TO TRUCK FLEET PROJECT INSTEAD OF FLEET
const apiKey = config.public.google_maps;

console.log(apiKey)

const loader = new Loader({
  apiKey: apiKey,
  version: 'weekly',
  libraries: ['places', 'geometry'],
});

const apiPromise = loader.load();
let geometry = await loader.importLibrary('geometry');


const center = { lat: 42.501825, lng: 27.464184 };
const orders = useOrdersStore();

await orders.init();
orders.filterByLicensePlate(licensePlate.value as string);

const lastOrder = ref<DocumentData | null>(null);

if (orders.companyOrders.length) {
  lastOrder.value = orders.companyOrders.sort((a, b) => b.createdAt - a.createdAt)[0];
}

// https://routes.googleapis.com/directions/v2:computeRoutes
const info = {
  "origin": {
    "location": {
      "latLng": {
        "latitude": 52.523430,
        "longitude": 13.411440,
      }
    }
  },
  "destination": {
    "location": {
      "latLng": {
        "latitude": center.lat,
        "longitude": center.lng,
      }
    }
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
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline,routes.legs.polyline,routes.legs.steps.polyline"
  },
})

console.log("routes", routes)

const routePolyline = computed(() => {
  if (routes.value === null) return {};

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
  <div class="overflow-hidden min-w-0 w-full rounded-xl relative">

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

    <div
      class="backdrop-blur-lg z-10 h-24 w-[95%] mx-5 border border-primary/25 rounded-xl absolute bottom-5 shadow-[0_0_15px_rgba(0,0,0,0.3)] shadow-primary/50">
      <h1>{{ lastOrder?.licensePlate }}</h1>
    </div>
  </div>
</template>

<style lang="scss"></style>
