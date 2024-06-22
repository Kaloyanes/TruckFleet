<script lang="ts" setup>
const props = defineProps({
  driver: {
    required: true,
    type: Object,
  },
});

const driverStore = useMyDriversStore();
const { license } = useRoute().params;
const clipboard = useClipboard();
const toast = useToast();

function copyToClipboard(textCopy: string) {
  useToast().add({
    title: `Copied to clipboard`,
    icon: "i-heroicons-check-circle",
  });
  clipboard.copy(textCopy);
}
</script>

<template>
  <div
    class="backdrop-blur-lg z-10 bg-neutral-900/15 border border-primary/25 rounded-3xl shadow-[0_0_5px_rgba(0,0,0,0.3)] shadow-primary/20 flex flex-col gap-2 p-6 w-full"
  >
    <div class="flex gap-2 w-full items-center">
      <TrucksDriverAvatar
        :driverUrl="props.driver.photoUrl"
        :driverName="props.driver.name"
        class="h-14 w-14"
      />
      <div class="flex flex-col">
        <h1>
          {{ props.driver.name }}
        </h1>
        <h2 class="text-gray-700">Driver</h2>
      </div>
      <div class="ml-auto space-x-3">
        <Button variant="outline" size="icon" class="rounded-full">
          <Icon name="i-tabler-message" size="20" />
        </Button>
        <Button variant="default" size="icon" class="rounded-full">
          <Icon name="i-tabler-phone" size="20" />
        </Button>
      </div>
    </div>
    <Separator />
    <div class="flex gap-3">
      <div
        class="flex flex-col cursor-pointer"
        @click="() => copyToClipboard(props.driver.phoneNumber)"
      >
        <h1 class="text-gray-500">Phone Number</h1>
        <h1>
          {{ props.driver.phoneNumber }}
        </h1>
      </div>
      <div
        class="flex flex-col cursor-pointer"
        @click="() => copyToClipboard(props.driver.email)"
      >
        <h1 class="text-gray-500">Email</h1>
        <h1>{{ props.driver.email }}</h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
