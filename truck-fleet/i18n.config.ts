export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      welcome: 'Welcome',
      login: "Login",
    },
    bg: {
      welcome: 'Добре дошли',
      login: "Вход"
    }
  },
}))
