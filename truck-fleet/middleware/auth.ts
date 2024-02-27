export default defineNuxtRouteMiddleware(async (to, from) => {

  const user = useSupabaseUser();

  if ((to.path === '/login' || to.path === '/register') && user.value !== null) {
    return navigateTo({
      path: '/'
    })
  }

  if (user.value === null) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }


})
