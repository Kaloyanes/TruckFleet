export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", () => {

    const colorMode = useColorMode()

    useHead({
      link: [
        { rel: 'icon', type: 'image/x-icon', href: colorMode.value === 'dark' ? '/lightFavicon.svg' : '/favicon.svg' }
      ],
    })
  })
})
