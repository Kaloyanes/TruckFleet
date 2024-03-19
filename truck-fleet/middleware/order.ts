export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(to);

  if (to.fullPath === "/dashboard/orders/") {
    await navigateTo("/dashboard/orders/all")
  }
})
