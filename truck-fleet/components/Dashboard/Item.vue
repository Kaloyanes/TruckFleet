<script lang="ts" setup>
const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
  exactType: {
    type: Boolean,
    default: false
  }

})

const route = useRoute();
const linkTitle = computed(() => {
  console.log(route.path, props.link.href)
  if (props.exactType) {
    return route.path === props.link.href
  }

  return route.path.includes(props.link.href);
})
</script>

<template>
  <HoverCard>
    <HoverCardTrigger>
      <div
        class="p-3 bg-neutral
        -900 rounded-md flex items-center justify-center duration-300 hover:bg-primary/50 hover:cursor-pointer hover:scale-105 active:scale-95"
        @click="$router.push(link.href)" :class="{ 'bg-primary': linkTitle, 'bg-[rgb(17,17,17)]': !linkTitle }">
        <slot name="icon">
          <UIcon :name="props.link.icon" class="w-6 h-6" :color="linkTitle ? 'black' : 'white'" />
        </slot>
      </div>
    </HoverCardTrigger>

    <HoverCardContent class="text-center w-min py-2" :class="{ 'hidden': linkTitle }">
      {{ props.link.title }}
    </HoverCardContent>
  </HoverCard>
</template>

<style lang="scss"></style>
