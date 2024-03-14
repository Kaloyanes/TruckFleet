export default defineNuxtRouteMiddleware(async (to, from) => {
  let auth = useFirebaseAuth();
  await auth?.authStateReady();
  let user = auth?.currentUser;

  if (user) {
    return navigateTo('/');
  }

  return;
})
