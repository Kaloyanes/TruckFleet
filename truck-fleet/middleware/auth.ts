
export default defineNuxtRouteMiddleware(async (to, from) => {

  const user = useSupabaseUser();

  // if ((to.path === '/login' || to.path === '/register') && user.value !== null) {
  //   return navigateTo({
  //     path: '/'
  //   })
  // }

  console.log('user', user.value);

  const localePath = useLocalePath()




  if (user.value === null) {
    return navigateTo({
      path: localePath('/login'),
      query: {
        redirect: to.fullPath
      }
    })
  }


})
