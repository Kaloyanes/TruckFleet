// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
    "nuxt-simple-sitemap",
    "@nuxtjs/google-fonts",
    "@hypernym/nuxt-anime",
    "@vueuse/nuxt",
  ],
  css: [
    "@/assets/css/tailwind.css",
  ],
  components: true,
  supabase: {
    url: process.env["SUPABASE_URL"],
    key: process.env["SUPABASE_KEY"],
    redirect: false,
  },
  i18n: {
    strategy: "no_prefix",
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English'
      },
      {
        code: 'bg',
        name: 'Bulgarian'
      }
    ],
    vueI18n: './i18n.config.ts',
    customRoutes: 'config',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root' // recommended
    },
  },
  site: {
    url: "http://localhost:3000",
  },




})
