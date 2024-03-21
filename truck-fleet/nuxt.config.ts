// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  experimental: {
    viewTransition: true,
  },
  app: {
    pageTransition: {
      name: 'page', mode: 'out-in', type: 'transition',
    },
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
      ]
    }
  },
  ssr: false,
  modules: [
    "nuxt-vuefire",
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@vee-validate/nuxt",
    "@formkit/auto-animate",
    "@nuxtjs/google-fonts",
    "@nuxtjs/sitemap",
    '@nuxtjs/tailwindcss', 'shadcn-nuxt'
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: "",
    fallback: 'dark',
    storageKey: 'color-mode',
  },
  css: [
    "@/assets/css/tailwind.css",
  ],
  vuefire: {
    auth: {
      enabled: true,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,

    },
    optionsApiPlugin: 'firestore',
  },
  postcss: {
    plugins: {
      tailwindcss: {
        config: "./tailwind.config.js",
      },
      autoprefixer: {},
    },
  },

  googleFonts: {
    families: {
      Inter: true,
    }
  },


})
