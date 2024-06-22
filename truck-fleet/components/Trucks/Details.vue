<script lang="ts" setup>
import { format } from "date-fns";
import type { Timestamp } from "firebase/firestore";

const props = defineProps({
  order: {
    required: true,
    type: Object,
  },
});

const pickUpStart = props.order.locations[0].pickUpTime.start as Timestamp;
const pickUpEnd = props.order.locations[0].pickUpTime.end as Timestamp;

const deliveryStart = props.order.locations[0].deliveryTime.start as Timestamp;
const deliveryEnd = props.order.locations[0].deliveryTime.end as Timestamp;
const router = useRouter();

function viewFile() {
  console.log("View File");
}
</script>

<template>
  <div
    class="backdrop-blur-lg z-10 bg-neutral-900/15 border border-primary/25 rounded-3xl shadow-[0_0_5px_rgba(0,0,0,0.3)] shadow-primary/20 flex flex-col items-center justify-center gap-2 p-6 w-full"
  >
    <div class="w-full flex justify-between">
      <div class="text-left">
        <h1>
          {{ order.locations[0].pickUpAddress as string }}
        </h1>
        <h1 class="text-gray-500">
          {{ format((pickUpStart as Timestamp).toDate(), "dd MMM | HH:00") }}
          -
          {{ format((pickUpEnd as Timestamp).toDate(), "dd MMM | HH:00") }}
        </h1>
      </div>

      <div class="text-right">
        <h1>
          {{ order.locations[0].deliveryAddress as string }}
        </h1>
        <h1 class="text-gray-500">
          {{ format((deliveryStart as Timestamp).toDate(), "dd MMM | HH:00") }}
          -
          {{ format((deliveryEnd as Timestamp).toDate(), "dd MMM | HH:00") }}
        </h1>
      </div>
    </div>

    <Separator />

    <div class="w-full flex items-center h-10">
      <div>
        <h1 class="text-gray-500">Order ID</h1>
        <h1>{{ order.id }}</h1>
      </div>

      <NuxtLink
        class="ml-auto"
        :href="props.order.documents[0].link"
        :external="true"
        target="_blank"
      >
        <Button variant="outline" @click="viewFile">View File</Button>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss"></style>
