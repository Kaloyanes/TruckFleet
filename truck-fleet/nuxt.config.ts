// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase"
  ],
  css: [
    "@/assets/css/tailwind.css",
  ],
  components: true,
  supabase: {
    url: process.env["SUPABASE_URL"],
    key: process.env["SUPABASE_KEY"],
    redirect: false,
  }


})
