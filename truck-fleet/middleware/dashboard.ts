export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/dashboard' || to.path === '/dashboard/') {
    return navigateTo('/dashboard/home')
  }


})
