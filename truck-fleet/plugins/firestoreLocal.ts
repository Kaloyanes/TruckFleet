export default defineNuxtPlugin(async (nuxtApp) => {
  await initFirestoreWithLocalCache();
})
