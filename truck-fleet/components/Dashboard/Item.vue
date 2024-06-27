<script lang="ts" setup>
const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
  exactType: {
    type: Boolean,
    default: false,
  },
  delayMs: {
    type: Number,
    default: 100,
  },
});

const route = useRoute();
const linkTitle = computed(() => {
  if (props.exactType) {
    return route.path === props.link.href;
  }

  return route.path.includes(props.link.href);
});
</script>

<template>
  <HoverCard :open-delay="0" :close-delay="0">
    <HoverCardTrigger as-child>
      <!-- <Motion
        :initial="{
          scale: 0,
          opacity: 0.5,
          transformOrigin: 'center center',
        }"
        :animate="{
          scale: 1,
          opacity: 1,

          transition: {
            // delay: props.delayMs + 250,

            // easing: spring({
            //   damping: 10,
            //   stiffness: 100,
            //   mass: 1,
            // }),

            delay: props.delayMs + 250,
            duration: 200,
          },
        }"
      > -->
      <div
        class="navigation-item flex items-center justify-center rounded-md bg-neutral-900 p-3 duration-300 hover:scale-105 hover:cursor-pointer hover:bg-primary/50 active:scale-95"
        @click="$router.push(link.href)"
        :class="{ 'bg-primary': linkTitle, 'bg-[rgb(17,17,17)]': !linkTitle }"
      >
        <slot name="icon">
          <UIcon
            :name="props.link.icon"
            class="h-6 w-6"
            :color="linkTitle ? 'black' : 'white'"
          />
        </slot>
      </div>
      <!-- </Motion> -->
    </HoverCardTrigger>

    <HoverCardContent
      class="w-min py-2 text-center"
      :class="{ hidden: linkTitle }"
    >
      {{ props.link.title }}
    </HoverCardContent>
  </HoverCard>
</template>

<style lang="scss"></style>
