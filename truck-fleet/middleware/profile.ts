export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/dashboard/profile') {
    await useRouter().replace('/dashboard/profile/account')
  }


})
