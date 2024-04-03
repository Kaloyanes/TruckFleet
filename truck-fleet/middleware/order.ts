export default defineNuxtRouteMiddleware(async (to, from) => {

  if (to.path === "/dashboard/orders") {
    await useRouter().replace("/dashboard/orders/all");
    return;
  }

  return;
})
