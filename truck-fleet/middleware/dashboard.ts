export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/dashboard' || to.path === '/dashboard/') {
    console.log('You are on the dashboard')
    return navigateTo('/dashboard/home')
  }


})
