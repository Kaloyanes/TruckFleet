<script lang="ts" setup>
const truckStore = useTrucksStore();
const orderStore = useOrdersStore();

const selectedTruck = computed(() =>
  truckStore.rawTrucks.find(
    (x) => x.licensePlate === useRoute().path.split("/")[3],
  ),
);

const truck = computed(() => useRoute().path.split("/")[3]);
const show = ref(false);

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 100);
});

watch(truck, () => {
  show.value = false;

  setTimeout(() => {
    show.value = true;
  }, 300);
});

const statuses = [
  "Available",
  "In Loading",
  "On Route",
  "Delivered",
  "Damaged",
];

const truckCapacityInPercentage = computed(() => {
  const truck = selectedTruck.value;
  if (!truck) return 0;

  const orders = orderStore.rawCompanyOrders.filter(
    (x) => x.truckId === truck.id && x.status !== "Delivered",
  );

  let totalWeight = 0;
  for (let order of orders) {
    console.log("orders", order);
    totalWeight += order.weight;
  }

  const totalCapacity = truck.capacity;

  return (totalWeight / totalCapacity) * 100;
});

const truckStatus = computed(() => selectedTruck.value?.status);

function updateStatus(newVal: string) {
  truckStore.updateTruckStatus(selectedTruck.value!.id, newVal);
}
</script>

<template>
  <Transition :key="truck" name="blur" :type="'transition'">
    <div v-if="show" class="flex p-6 gap-4 items-center justify-between">
      <h1>{{ selectedTruck!.licensePlate }}</h1>
      <div class="flex-[0.4] select-none">
        <Select v-model="truckStatus" @update:model-value="updateStatus">
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Statuses</SelectLabel>
              <SelectItem
                v-for="status in statuses"
                :value="status"
                class="capitalize"
              >
                {{ status }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        class="progress-bar"
        style="
          width: 100px;
          height: 100px;
          border-radius: 50%;
          transition: all;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        "
        :style="{
          background: `radial-gradient(
              closest-side,
              white ${80}%,
              transparent ${0}% 100%
            ),
            conic-gradient(hotpink ${truckCapacityInPercentage}%, pink 0)`,
        }"
      />
    </div>
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

.progress-bar {
}
</style>
