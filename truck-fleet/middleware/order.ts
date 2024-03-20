export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log("Order middleware", to);

  if (to.path === "/dashboard/orders") {
    await useRouter().replace("/dashboard/orders/all");
    return;
  }

  return;
})
