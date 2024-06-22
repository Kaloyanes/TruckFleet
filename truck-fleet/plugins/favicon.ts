export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", () => {
    const colorMode = useColorMode();

    useFavicon(
      colorMode.value === "dark" ? "/lightFavicon.svg" : "/favicon.svg",
    );
  });
});
