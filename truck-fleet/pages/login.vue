<script lang="ts" setup>
definePageMeta({
  pageTransition: false,
  layoutTransition: false,
  middleware: 'login'
})

const items = [{
  label: 'Login',
  skd: ''
}, {
  label: 'Register',
  skd: 'register'
}]


let num = 5;

function addNumbers(num1: number, num2: number) {
  return num1 + num2;
}

addNumbers(1, 5);


const route = useRoute()
const router = useRouter()

const selected = computed({
  get() {
    const index = items.findIndex((item) => item.label === route.query.tab)
    if (index === -1) {
      return 0
    }

    return index
  },
  set(value) {
    // navigateTo(items[value].label.toLowerCase())
    router.replace(`/login/${items[value].skd.toLowerCase()}`)
  }
})

</script>

<template>
  <Transition mode="in-out">

    <div class="h-screen flex flex-col justify-center">

      <div class="w-full flex justify-center">
        <div class="w-1/2 md:w-2/6 xl:w-1/6">
          <UTabs v-model="selected" :items="items" />
        </div>
      </div>

      <NuxtPage />
    </div>
  </Transition>
</template>
