export default defineNuxtRouteMiddleware(async (to, from) => {
  let auth = useFirebaseAuth();
  await auth?.authStateReady();
  let user = auth?.currentUser;
 

  if (user && to.path === '/login' || to.path === '/register') {
    return navigateTo('/');
  }

  if (!user && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login');
  }

  return;

})
