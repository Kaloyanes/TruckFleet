<script lang="ts" setup>
import { Loader } from "@googlemaps/js-api-loader";
import { CustomMarker, GoogleMap, Polyline } from "vue3-google-map";

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
  lastOrder: {
    required: true,
  },
});

const loader = new Loader({
  apiKey: props.apiKey,
  version: "weekly",
  libraries: ["places", "geometry"],
});

let geometry = await loader.importLibrary("geometry");

// https://routes.googleapis.com/directions/v2:computeRoutes
const info = {
  origin: {
    address: (props.lastOrder as any).locations[0].pickUpAddress,
  },
  destination: {
    address: (props.lastOrder as any).locations[0].deliveryAddress,
  },
  travelMode: "DRIVE",
  routingPreference: "TRAFFIC_AWARE",
  computeAlternativeRoutes: false,
  routeModifiers: {
    avoidTolls: false,
    avoidHighways: false,
    avoidFerries: false,
  },
  languageCode: "en-US",
  units: "METRIC",
};

const { data: routes, status: routesPending } = useFetch(
  "https://routes.googleapis.com/directions/v2:computeRoutes",
  {
    method: "POST",
    body: info,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": props.apiKey,
      "X-Goog-FieldMask":
        "routes.duration,routes.distanceMeters,routes.polyline,routes.legs.polyline,routes.legs.steps.polyline",
      "Access-Control-Allow-Origin": "*",
    },
  },
);

const center = ref<{ lat: number; lng: number } | null>(null);
const pickUpAddressCoordinates = ref<{ lat: number; lng: number } | null>(null);

const routePolyline = computed(() => {
  if (routes.value === null) return {};

  const steps = (routes.value as any).routes[0].legs[0].steps;
  console.log(
    "routes",
    geometry.encoding
      .decodePath(steps[steps.length - 1].polyline.encodedPolyline)[0]
      .lat(),
  );

  center.value = {
    lat: geometry.encoding
      .decodePath(steps[steps.length - 1].polyline.encodedPolyline)[0]
      .lat(),
    lng: geometry.encoding
      .decodePath(steps[steps.length - 1].polyline.encodedPolyline)[0]
      .lng(),
  };

  pickUpAddressCoordinates.value = {
    lat: geometry.encoding
      .decodePath(steps[0].polyline.encodedPolyline)[0]
      .lat(),
    lng: geometry.encoding
      .decodePath(steps[0].polyline.encodedPolyline)[0]
      .lng(),
  };

  return {
    path: geometry.encoding.decodePath(
      (routes.value as any).routes[0].polyline.encodedPolyline,
    ),
    geodesic: true,
    strokeColor: "#5A32B4",
    strokeOpacity: 1,
    strokeWeight: 3,
  };
});

const currentZoom = ref(13);

watch(currentZoom, (value) => {
  console.log("currentZoom", value);

  if (value >= 14) {
    currentZoom.value = 14;
  }
});
</script>

<template>
  <div class="relative" v-if="!routesPending">
    <div class="right-5 top-5 absolute z-50 flex flex-col">
      <Button
        @click="currentZoom++"
        :size="'icon'"
        variant="outline"
        class="rounded-b-none"
      >
        <UIcon
          name="i-material-symbols-light-zoom-in-rounded"
          size="30"
          color="#fff"
        />
      </Button>
      <Button
        @click="currentZoom--"
        :size="'icon'"
        variant="outline"
        class="rounded-t-none"
      >
        <UIcon
          name="i-material-symbols-light-zoom-out-rounded"
          size="30"
          color="#fff"
        />
      </Button>
    </div>

    <GoogleMap
      :api="apiKey"
      style="height: 101vh; border: 0px"
      :center="center"
      :zoom-control="false"
      :map-type-control="false"
      :street-view-control="false"
      :fullscreen-control="false"
      :disable-default-ui="true"
      :zoom="currentZoom"
      :min-zoom="3"
      :max-zoom="13.9"
      map-id="b514deccd04f2a38"
      background-color="transparent"
      :zoom-control-position="'TOP_RIGHT'"
    >
      <template #default="{ map, api, ready, mapTilesLoaded }">
        <CustomControl position="TOP_LEFT" :z-index="100">
          <Button>kofkaofsaof</Button>
        </CustomControl>

        <CustomMarker
          :options="{ position: center, anchorPoint: 'BOTTOM_CENTER' }"
        >
          <div
            style="text-align: center"
            class="bg-primary h-full w-full flex flex-col justify-center items-center rounded-full p-1 relative"
          >
            <UIcon size="15" name="ic:baseline-location-on" color="#000" />
            <div class="p-4 -z-10 bg-primary/50 absolute rounded-full"></div>
          </div>
        </CustomMarker>

        <CustomMarker
          :options="{
            position: pickUpAddressCoordinates,
            anchorPoint: 'BOTTOM_CENTER',
          }"
        >
          <div
            style="text-align: center"
            class="bg-primary h-full w-full flex flex-col justify-center items-center rounded-full p-1 relative"
          >
            <UIcon size="15" name="ic:baseline-location-on" color="#000" />
            <div class="p-4 -z-10 bg-primary/50 absolute rounded-full"></div>
          </div>
        </CustomMarker>

        <Polyline :options="routePolyline" />
      </template>
    </GoogleMap>
  </div>

  <div v-else class="z-[999999] flex justify-center align-center">
    <div
      class="p-4 absolute h-full w-full bg-[rgb(17,17,17)] rounded-xl flex flex-col justify-center items-center"
    >
      <!-- <h1 class="text-center text-3xl font-sans">Loading maps</h1> -->
      <CircularProgressIndicator />
    </div>
  </div>
</template>

<style lang="scss"></style>
