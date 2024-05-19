<script lang="ts" setup>
var titles = ["Drivers", "Speditors"]
</script>

<template>
  <div class="flex w-full max-w-full my-2 mr-2 gap-3 items-center">

    <ScrollArea class=" h-full flex-[0.3] rounded-2xl">
      <div class="flex flex-col gap-3">

        <div class="rounded-2xl w-full bg-[rgb(17,17,17)]" v-for="title in titles">
          <h1 class="text-center py-5 text-xl font-semibold font-sans">{{ title }}</h1>

          <div v-for="i in 10" :key="i" class=" h-20 mx-5">
            {{ i }}
          </div>
        </div>
      </div>
    </ScrollArea>

    <div class="flex-1 h-full rounded-2xl bg-[rgb(17,17,17)]">
      <h1>Chat Window</h1>
    </div>

    <div class="flex-[0.3] h-full rounded-2xl bg-[rgb(17,17,17)]">
      <h1>Chat Info</h1>
    </div>


  </div>
</template>
